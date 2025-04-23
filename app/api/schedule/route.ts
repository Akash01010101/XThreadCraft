import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";
import { TwitterApi, SendTweetV2Params } from "twitter-api-v2";
import { BlobServiceClient } from "@azure/storage-blob";

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

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;

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

    const { data: threads, error } = await supabase
      .from("threads")
      .select("*")
      .lte("scheduled_time", new Date().toISOString())
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

    for (const thread of threads) {
      try {
        const accessToken = thread.accessToken || thread.access_token;
        const accessSecret = thread.accessSecret || thread.access_secret;

        if (!accessToken || !accessSecret) {
          console.error(`No Twitter credentials for thread ${thread.id}`);
          continue;
        }

        const client = await getTwitterClient(accessToken, accessSecret);
        const tweetsPayload: SendTweetV2Params[] = [];

        for (const t of thread.content) {
          const tweet: SendTweetV2Params = { text: t.content };

          if (t.imageUrl) {
            try {
              const response = await fetch(t.imageUrl, {
                headers: {
                  'x-ms-blob-type': 'BlockBlob',
                  'x-ms-version': '2020-04-08'
                }
              });

              const imageBuffer = await response.arrayBuffer();
              const mimeType = response.headers.get('content-type') || 'image/jpeg';

              const mediaId = await client.v1.uploadMedia(Buffer.from(imageBuffer), { mimeType });
              tweet.media = { media_ids: [mediaId] };

              // Delete image from Azure
              try {
                const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
                const url = new URL(t.imageUrl);
                const pathParts = url.pathname.split("/");
                const containerName = pathParts[1];
                const blobName = decodeURIComponent(pathParts.slice(2).join("/"));

                const containerClient = blobServiceClient.getContainerClient(containerName);
                const blobClient = containerClient.getBlobClient(blobName);
                await blobClient.deleteIfExists();

                console.log(`Deleted blob: ${blobName}`);
              } catch (deleteError) {
                console.warn(`Failed to delete blob:`, deleteError);
              }

            } catch (mediaError) {
              console.error("Error uploading image:", mediaError);
            }
          }

          tweetsPayload.push(tweet);
        }

        const response = await client.v2.tweetThread(tweetsPayload);
        console.log("Tweet thread posted successfully:", response);

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
