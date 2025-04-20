"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
interface Tweet {
  id: string;
  text: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}
interface CachedData {
  tweets: Tweet[];
  timestamp: number;
}
const CACHE_DURATION = 1000 * 60 * 60 *2; 
export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getCachedData = (): CachedData | null => {
    const cachedData = localStorage.getItem('analyticsData');
    if (!cachedData) return null;
    return JSON.parse(cachedData);
  };
  const setCachedData = (tweets: Tweet[]) => {
    const data: CachedData = {
      tweets,
      timestamp: Date.now(),
    };
    localStorage.setItem('analyticsData', JSON.stringify(data));
  };

  const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < CACHE_DURATION;
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!session?.user?.id) return;

      try {
        // Check cache first
        const cachedData = getCachedData();
        if (cachedData && isCacheValid(cachedData.timestamp)) {
          setTweets(cachedData.tweets);
          setLoading(false);
          return;
        }

        // If cache is invalid or doesn't exist, fetch from API
        const res = await fetch('/api/analytics', {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
            'X-Access-Secret': session.accessSecret || ''
          }
        });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 429) {
            const waitTimeMinutes = Math.ceil(data.waitTime / 60);
            setError(`Rate limit exceeded. Please wait ${waitTimeMinutes} minute${waitTimeMinutes > 1 ? 's' : ''} before trying again. (Reset at ${new Date(data.resetTime).toLocaleTimeString()})`);
            return;
          }
          throw new Error(data.error || "Failed to fetch analytics.");
        }

        const newTweets = data.tweets || [];
        setTweets(newTweets);
        setCachedData(newTweets); // Cache the new data
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchAnalytics();
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-muted rounded mb-4 mx-auto"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">Please log in to view analytics.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No tweets found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between py-6">
        <h1 className="text-3xl font-bold tracking-tight">Tweet Analytics</h1>
      </div>
      <AnalyticsDashboard tweets={tweets} />
    </div>
  );
}