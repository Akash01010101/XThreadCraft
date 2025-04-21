import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { TwitterApi, SendTweetV2Params } from "twitter-api-v2";

interface ThreadContent {
  content: string;
  imageUrl?: string;
}

interface Thread {
  id: string;
  user_id: string;
  content: ThreadContent[];
  scheduled_time: string;
  is_posted: boolean;
  accessToken?: string;
  access_token?: string;
  accessSecret?: string;
  access_secret?: string;
}


async function getTwitterClient(userAccessToken: string, userAccessSecret: string): Promise<TwitterApi> {
  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: userAccessToken,
    accessSecret: userAccessSecret,
  });
}

export async function GET() {
  try {
     const supabase = getSupabaseClient();
    console.log("Checking for scheduled tweets...");

    // Fetch threads that are scheduled but not posted
    const { data: threads, error } = await supabase
      .from("threads")
      .select("*")
      .lte("scheduled_time", new Date().toISOString()) // Only tweets scheduled until now
      .eq("is_posted", false)
      .order("scheduled_time", { ascending: true })
      .returns<Thread[]>();

    if (error) {
      console.error("Error fetching scheduled tweets:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!threads || threads.length === 0) {
      console.log("No scheduled tweets to post.");
      return NextResponse.json({ success: true, message: "No pending tweets" });
    }

    // Process each scheduled thread
    for (const thread of threads) {
      try {
        console.log(`Posting scheduled tweet for user ${thread.user_id}`);

        // Retrieve credentials from the thread record (adjust field names as necessary)
        const accessToken = thread.accessToken || thread.access_token;
        const accessSecret = thread.accessSecret || thread.access_secret;

        if (!accessToken || !accessSecret) {
          console.error(`No Twitter credentials found for thread ${thread.id}`);
          continue; // Skip if credentials are missing.
        }

        const client = await getTwitterClient(accessToken, accessSecret);

        // Convert thread.content (an array) to a payload for tweetThread.
        // Each element should have a 'text' property.
        const tweetsPayload: SendTweetV2Params[] = [];
        
        // Process each tweet in the thread
        for (const t of thread.content) {
          const tweet: SendTweetV2Params = { text: t.content };
          
          // If there's an image URL, upload it
          if (t.imageUrl) {
            try {
              const response = await fetch(t.imageUrl);
              const imageBuffer = await response.arrayBuffer();
              const mimeType = response.headers.get('content-type') || 'image/jpeg';
              const mediaId = await client.v1.uploadMedia(Buffer.from(imageBuffer), { mimeType });
              tweet.media = { media_ids: [mediaId] };
            } catch (mediaError) {
              console.error('Error uploading image:', mediaError);
            }
          }
          
          tweetsPayload.push(tweet);
        }

        // Post the tweet thread using the Twitter API client
        const response = await client.v2.tweetThread(tweetsPayload);

        console.log("Tweet thread posted successfully:", response);

        // Delete thread from the database after successful posting
        const { error: deleteError } = await supabase
          .from("threads")
          .delete()
          .eq("id", thread.id);

        if (deleteError) {
          console.error(`Error deleting thread ${thread.id}:`, deleteError);
        } else {
          console.log(`Thread ${thread.id} deleted successfully.`);
        }
      } catch (tweetError) {
        console.error(`Error posting tweet for thread ${thread.id}:`, tweetError);
      }
    }

    return NextResponse.json({ success: true, message: "Scheduled tweets processed" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
