"use client";

import { useState,useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageIcon, SaveIcon, Loader2, BarChart } from "lucide-react";
import { ThreadPreview } from "./thread-preview";
import { motion } from "framer-motion";
import Link from "next/link";
import SearchExperience from "../app/test/page";
import { supabase } from "@/lib/supabase";

interface Tweet {
  content: string;
  imageFile?: File;
  imageUrl?: string;
}

export function ThreadComposer() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [content, setContent] = useState<string>("");
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const savedThread = localStorage.getItem('draftThread');
    if (savedThread) {
      try {
        const { title: savedTitle, content: savedContent } = JSON.parse(savedThread);
        setTitle(savedTitle);
        setTweets(savedContent);
        localStorage.removeItem('draftThread');
      } catch (error) {
        console.error('Error loading saved thread:', error);
      }
    }
  }, []);

  const splitTweet = (text: string): string[] => {
    // First split by delimiter
    const manualSplits = text.split("___").map(part => part.trim()).filter(part => part.length > 0);
    
    // Then split any tweets that exceed character limit
    const maxLength = 260;
    const finalTweets: string[] = [];
    
    manualSplits.forEach(tweet => {
      if (tweet.length <= maxLength) {
        finalTweets.push(tweet);
      } else {
        // Split long tweet into multiple tweets
        let remainingText = tweet;
        while (remainingText.length > 0) {
          // Find last space within character limit
          let splitIndex = remainingText.slice(0, maxLength).lastIndexOf(" ");
          if (splitIndex === -1 || splitIndex === 0) {
            splitIndex = Math.min(maxLength, remainingText.length);
          }
          
          finalTweets.push(remainingText.slice(0, splitIndex).trim());
          remainingText = remainingText.slice(splitIndex).trim();
        }
      }
    });
    
    return finalTweets;
  };


  const handleAddTweet = () => {
    if (content.trim() || currentImageFile) {
      const splitContent = splitTweet(content);
      const newTweets: Tweet[] = splitContent.map((tweetContent, index) => {
        const tweet: Tweet = {
          content: tweetContent,
          imageFile: index === 0 && currentImageFile ? currentImageFile : undefined,
        };
        if (tweet.imageFile) {
          tweet.imageUrl = URL.createObjectURL(tweet.imageFile);
        }
        return tweet;
      });
      setTweets([...tweets, ...newTweets]);
      setContent("");
      setCurrentImageFile(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.email) {
      console.log("Session:", session);
      console.error("User not authenticated.");
      return;
    }
  
    if (!title.trim()) {
      alert("Please enter a title for your thread");
      return;
    }
  
    if (tweets.length === 0) {
      alert("Please add at least one tweet to your thread");
      return;
    }
  
    try {
      setIsSaving(true);
  
      // Upload images to Supabase and get URLs
      const tweetsWithUrls = await Promise.all(
        tweets.map(async (tweet) => {
          if (tweet.imageFile) {
            const fileName = `${Date.now()}-${tweet.imageFile.name}`;
            const {  error } = await supabase.storage
              .from('thread-images')
              .upload(fileName, tweet.imageFile);

            if (error) throw error;

            const imageUrl = supabase.storage
              .from('thread-images')
              .getPublicUrl(fileName).data.publicUrl;

            return { content: tweet.content, imageUrl };
          }
          return { content: tweet.content };
        })
      );
  
      const response = await fetch("/api/thread/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.email,
          title: title.trim(),
          content: tweetsWithUrls,
          accessToken: session.accessToken,
          accessSecret: session.accessSecret,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save thread");
      }
  
      const data = await response.json();
      console.log("Thread saved:", data);
      setTitle("");
    } catch (error) {
      console.error("Error saving thread:", error);
    } finally {
      setIsSaving(false);
    }
  };
  

  const handleSubmit = async () => {
    if (!session) return console.error("User not authenticated.");
  
    const userAccessToken = session?.accessToken;
    const userAccessSecret = session?.accessSecret;
    if (!userAccessToken || !userAccessSecret) {
      return console.error("Missing Twitter tokens.");
    }
  
    try {
      if (tweets.length === 0) return console.error("No tweets to post.");
  
      setIsPosting(true);
  
      // Upload any images that are File objects and get their URLs
      const tweetsWithImageUrls = await Promise.all(
        tweets.map(async (tweet) => {
          if (tweet.imageFile) {
            const fileName = `${Date.now()}-${tweet.imageFile.name}`;
            const { error } = await supabase.storage
              .from("thread-images")
              .upload(fileName, tweet.imageFile);
  
            if (error) throw error;
  
            const publicUrl = supabase.storage
              .from("thread-images")
              .getPublicUrl(fileName).data.publicUrl;
  
            return { content: tweet.content, imageUrl: publicUrl };
          }
          return { content: tweet.content };
        })
      );
  
      // Use JSON instead of FormData now
      const response = await fetch("/api/thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAccessToken,
          userAccessSecret,
          tweets: tweetsWithImageUrls,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to post thread: ${response.status} ${errorText}`);
      }
  
      const data = await response.json();
      console.log("Thread posted:", data);
      setTweets([]);
    } catch (error) {
      console.error("Error posting thread:", error);
    } finally {
      setIsPosting(false);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Input
                type="text"
                placeholder="Thread Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-4"
              />
              <Textarea
                placeholder="Add your long text here to split it into tweets. Use the delimiter '___' to separate tweets manually or use the AI for copywriting and generate threads."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[100px] resize-none"
              />
            </motion.div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                </label>
                {/* Button to open popup */}
      <button
        onClick={() => setIsOpen(true)}
        className="mt-2 px-4 py-2 text-sm text-white bg-black-100 rounded cursor-pointer"
      >
        GIF Search
      </button>

      {/* Modal */}
      {isOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 relative">
    
      {/* Close Button */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-gray-900"
      >
        &times;
      </button>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg font-semibold">Search for GIFs</h2>
        <p className="text-sm text-gray-500">Powered by GIPHY</p>
      </div>

      {/* GIF Search Component */}
      <SearchExperience />
    </div>
  
)}
              </div>
              <Button
                onClick={handleAddTweet}
                disabled={!content.trim() && !currentImageFile}
                className="ml-auto"
              >
                Add Tweet
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 }}
      >
        <ThreadPreview tweets={tweets} setTweets={setTweets} />
        <div className="mt-6 flex justify-end space-x-4">
          <Link href="/analytics">
            <Button variant="outline" className="gap-2">
              <BarChart className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isSaving || tweets.length === 0}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="mr-2 h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPosting || tweets.length === 0}
          >
            {isPosting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Thread"
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
