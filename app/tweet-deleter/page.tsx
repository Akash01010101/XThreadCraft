"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Heart, RefreshCw, Search, Trash2, X } from "lucide-react"
import { format } from "date-fns"

interface Tweet {
  id: string
  text: string
  created_at: string
  public_metrics: {
    retweet_count: number
    reply_count: number
    like_count: number
    quote_count: number
    impression_count: number
  }
}
interface ExtendedSession {
  accessToken?: string;
  accessSecret?: string;
  tokenTimestamp?: number;
}

export default function TweetDeleterPage() {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [minLikes, setMinLikes] = useState<number>(0)
  const { data: session } = useSession();
 

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    console.log(session)
    fetchTweets()
  }, [session])

  const CACHE_DURATION = 1000 * 60 * 60 * 2; // 4 hours in milliseconds

  const getCachedData = (): Tweet[] | null => {
    const cachedData = localStorage.getItem('tweetDeleterData');
    if (!cachedData) return null;
    const parsedData = JSON.parse(cachedData);
    if (Date.now() - parsedData.timestamp < CACHE_DURATION) {
      return parsedData.tweets;
    }
    return null;
  };

  const setCachedData = (tweets: Tweet[]) => {
    const data = {
      tweets,
      timestamp: Date.now(),
    };
    localStorage.setItem('tweetDeleterData', JSON.stringify(data));
  };

  const [isRefreshing, setIsRefreshing] = useState(false)
  const fetchTweets = async (forceRefresh = false) => {
    if (isRefreshing) return;
    setLoading(true);
    setIsRefreshing(forceRefresh);
    
    try {
      const cachedTweets = !forceRefresh ? getCachedData() : null;
      if (cachedTweets) {
        setTweets(cachedTweets);
        setError(null);
        setLoading(false);
        return;
      }
  
      // Verify session availability and validity
      if (!session) {
        setError('Session not available. Please refresh the page.');
        setLoading(false);
        return;
      }
  
      if (!session?.accessToken || !session?.accessSecret) {
        setError('Missing Twitter authentication tokens.');
        setLoading(false);
        return;
      }
  
      // Validate token expiration
      const tokenTimestamp = (session as ExtendedSession)?.tokenTimestamp;
  
      if (tokenTimestamp && Date.now() - tokenTimestamp > 3600 * 1000) {
        setError("Authentication token expired. Please refresh the page.");
        setLoading(false);
        return;
      }
  
      // Only proceed with API call if all checks pass
      const response = await fetch("/api/analytics?timeframe=3M", {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'X-Access-Secret': session.accessSecret
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch tweets");
      }
      const data = await response.json();
      setTweets(data.tweets);
      setCachedData(data.tweets);
      setError(null);
    } catch (err) {
      console.error("Error fetching tweets:", err);
      setError("Failed to load tweets. Please try again later.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }
  const handleBulkDelete = async () => {
    try {
      if (!tweets || tweets.length === 0) return;
  
      const tweetsToDelete = tweets.filter(
        (tweet) => tweet.public_metrics.like_count < minLikes
      );
  
      for (const tweet of tweetsToDelete) {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken ?? ""}`,
          ...(session?.accessSecret && { "X-Access-Secret": session.accessSecret }),
        };
  
        const response = await fetch(`/api/analytics/delete-tweet`, {
          method: "DELETE",
          headers,
          body: JSON.stringify({ tweetId: tweet.id }),
        });
  
        if (response.status === 429) {
          const data = await response.json();
          setError(
            `Rate limit exceeded. Tweets will be automatically deleted after ${Math.ceil(
              data.waitTime / 1000
            )} seconds. Please wait...`
          );
          return;
        }
  
        if (!response.ok) {
          throw new Error(`Failed to delete tweet with ID: ${tweet.id}`);
        }
      }
  
      // Update state to remove deleted tweets
      const updatedTweets = tweets.filter(
        (tweet) => tweet.public_metrics.like_count >= minLikes
      );
      setTweets(updatedTweets);
      setCachedData(updatedTweets);
    } catch (error) {
      console.error("Error during bulk delete:", error);
      setError("Failed to perform bulk delete. Please try again later.");
    }
  };
  const deleteTweet = async (tweetId: string) => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken ?? ""}`,
        ...(session?.accessSecret && { "X-Access-Secret": session.accessSecret }),
      };
  
      const response = await fetch(`/api/analytics/delete-tweet`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ tweetId }),
      });
  
      if (response.status === 429) {
        const data = await response.json();
        const waitTimeInSeconds = Math.ceil(data.waitTime / 1000);
        const resetTime = new Date(data.resetTime);
        
        setError(
          `Rate limit exceeded. Twitter API limits reached. Next deletion attempt will be possible at ${resetTime.toLocaleTimeString()}. Please wait approximately ${waitTimeInSeconds} seconds...`
        );

        // Schedule automatic retry
        setTimeout(() => {
          setError(null);
          deleteTweet(tweetId);
        }, data.waitTime);
        return;
      }
  
      if (!response.ok) {
        throw new Error("Failed to delete tweet");
      }
  
      // Remove the deleted tweet from the state
      const updatedTweets = tweets.filter((tweet) => tweet.id !== tweetId);
      setTweets(updatedTweets);
      setCachedData(updatedTweets);
    } catch (error) {
      console.error("Error deleting tweet:", error);
      setError("Failed to delete tweet. Please try again later.");
    }
  };

  const filteredTweets = tweets.filter((tweet) => tweet.text.toLowerCase().includes(searchQuery.toLowerCase()))

  if (loading && tweets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-12 h-12 text-primary animate-spin" />
          <p className="text-lg text-foreground">Loading tweets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <X className="w-12 h-12 text-destructive" />
          <p className="text-lg text-foreground">{error}</p>
          <Button onClick={()=>fetchTweets}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground mt-16 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Trash2 className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold">Tweet Deleter</h1>
        </div>

        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Delete Your Tweets</CardTitle>
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchTweets(true)}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Use this tool to find and delete your tweets. Once deleted, tweets cannot be recovered.
            </p>
            <div className="relative mb-6">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tweets..."
                className="pl-8 bg-background border-border text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {filteredTweets.length > 0 ? (
                  filteredTweets.map((tweet) => (
                    <div key={tweet.id} className="p-4 border border-border rounded-md group">
                      <div className="flex justify-between">
                        <p className="text-sm">{tweet.text}</p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Tweet</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this tweet? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-secondary hover:bg-secondary/80">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => deleteTweet(tweet.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>{format(new Date(tweet.created_at), "MMM d, yyyy")}</span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" /> {tweet.public_metrics.like_count}
                          </span>
                          <span className="flex items-center">
                            <RefreshCw className="w-3 h-3 mr-1" /> {tweet.public_metrics.retweet_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center p-6 border border-dashed border-border rounded-md">
                    <p className="text-muted-foreground">No tweets found</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="mt-8">
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  placeholder="Minimum likes"
                  className="w-40 bg-background border-border text-foreground"
                  value={minLikes}
                  onChange={(e) => setMinLikes(Number(e.target.value))}
                />
                <Button
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Tweets Below Threshold
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}