"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";


interface Tweet {
  content: string;
  imageFile?: File;
  imageUrl?: string; // Store preview URL
}

interface ThreadPreviewProps {
  tweets: Tweet[];
  setTweets: (tweets: Tweet[]) => void; // Allow updating tweets
}

export function ThreadPreview({ tweets, setTweets }: ThreadPreviewProps) {
  
  const { data: session } = useSession();
  const handleDeleteTweet = (index: number) => {
    setTweets(tweets.filter((_, i) => i !== index));
  };
  
  const handleMoveTweet = (index: number, direction: "up" | "down") => {
    const newTweets = [...tweets];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newTweets[index], newTweets[swapIndex]] = [newTweets[swapIndex], newTweets[index]];
    setTweets(newTweets);
  };
  

  const handleImageChange = (index: number, input: File | string | null) => {
    if (!input) return;

    const newTweets = [...tweets];

    if (typeof input === "string") {
        // If it's a URL (Giphy link)
        newTweets[index].imageFile = undefined;
        newTweets[index].imageUrl = input;
    } else {
        // If it's a file
        newTweets[index].imageFile = input;
        newTweets[index].imageUrl = URL.createObjectURL(input);
    }

    setTweets(newTweets);
};

  return (
    <div className="space-y-6">
      {tweets.map((tweet, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="group"
        >
          <div className="flex space-x-4 p-4 rounded-lg bg-background/50 dark:bg-background/30 backdrop-blur-sm border border-border dark:border-border/50 hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-primary/5">
            <Avatar className="w-10 h-10 border-2 border-primary/10 dark:border-primary/20">
              <AvatarImage src={session?.user?.image || "/placeholder.svg"} className="object-cover" />
              <AvatarFallback className="bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary/90">
                {session?.user?.name?.[0]?.toUpperCase() || "UN"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="font-semibold text-foreground dark:text-foreground/90">
                  {session?.user?.name ?? "User Name"}
                </div>
                <div className="text-sm text-muted-foreground dark:text-muted-foreground/80">
                  Tweet {index + 1}
                </div>
              </div>
              <textarea
                value={tweet.content}
                onChange={(e) => {
                  const newTweets = [...tweets];
                  newTweets[index].content = e.target.value;
                  setTweets(newTweets);
                }}
                className="w-full bg-transparent border border-border dark:border-border/50 rounded-lg p-2 text-foreground dark:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
              />
              <div className="flex space-x-2">
              <button
                onClick={() => handleMoveTweet(index, "up")}
                disabled={index === 0}
                className="p-2 bg-gray-800 text-white hover:bg-gray-600 rounded-md text-sm disabled:opacity-50"
              >
                ▲
              </button>
              <button
                onClick={() => handleMoveTweet(index, "down")}
                disabled={index === tweets.length - 1}
                className="p-2 bg-gray-800 text-white hover:bg-gray-600 rounded-md text-sm disabled:opacity-50"
              >
                ▼
              </button>
              <button
                onClick={() => handleDeleteTweet(index)}
                className="p-2 bg-red-700 text-white hover:bg-red-500 rounded-md text-sm"
              >
                ✖
              </button>

              </div>

              {/* Image Preview */}
              {tweet.imageUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 relative rounded-lg overflow-hidden bg-muted dark:bg-muted/30 border border-border dark:border-border/50 group-hover:border-primary/20 dark:group-hover:border-primary/30 transition-all duration-300"
                >
                  <Image
                    src={tweet.imageUrl}
                    alt="Tweet image"
                    width={400}
                    height={300}
                    className="object-cover w-full max-h-[300px] transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </motion.div>
              )}

              {/* Image Upload Input */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)}
                className="mt-2 text-sm text-primary cursor-pointer file:hidden"
              />

<div>
      

    </div>
            </div>

          </div>
        </motion.div>
      ))}

      {tweets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground dark:text-muted-foreground/70 bg-background/50 dark:bg-background/30 backdrop-blur-sm rounded-lg border border-border dark:border-border/50">
          <p>Your thread preview will appear here</p>
        </div>
      )}
    </div>
  );
}
