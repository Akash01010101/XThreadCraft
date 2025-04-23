import { NextResponse } from "next/server";
import { TwitterApi, SendTweetV2Params } from "twitter-api-v2"; // if you're not using node-fetch, the built-in fetch works too in Next.js API routes

// Create Twitter client
async function getTwitterClient(userAccessToken: string, userAccessSecret: string): Promise<TwitterApi> {
  if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
    throw new Error("Twitter API credentials are not configured");
  }

  return new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: userAccessToken,
    accessSecret: userAccessSecret,
  });
}

export async function POST(request: Request) {
  try {
    console.log("API request received...");

    const body = await request.json();
    const { userAccessToken, userAccessSecret, tweets } = body;

    if (!userAccessToken || !userAccessSecret) {
      console.error("Missing user credentials");
      return NextResponse.json({ success: false, error: "Missing user credentials" }, { status: 400 });
    }

    console.log("User credentials received, initializing Twitter API client...");
    const client = await getTwitterClient(userAccessToken, userAccessSecret);
    console.log("Twitter API client initialized.");

    const preparedTweets: SendTweetV2Params[] = [];

    for (let i = 0; i < tweets.length; i++) {
      const { content, imageUrl } = tweets[i];
      const tweet: SendTweetV2Params = { text: content };

      if (imageUrl) {
        try {
          const response = await fetch(imageUrl, {
            headers: {
              'x-ms-blob-type': 'BlockBlob',
              'x-ms-version': '2020-04-08'
            }
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }
          const buffer = Buffer.from(await response.arrayBuffer());
          const contentType = response.headers.get("content-type") || "image/jpeg";

          console.log(`Uploading image to Twitter for tweet ${i}...`);
          const mediaId = await client.v1.uploadMedia(buffer, { mimeType: contentType });
          tweet.media = { media_ids: [mediaId] as [string] };
          console.log(`Image uploaded for tweet ${i}: ${mediaId}`);
        } catch (mediaError) {
          console.error(`Error processing image for tweet ${i}:`, mediaError);
        }
      }

      preparedTweets.push(tweet);
    }

    if (preparedTweets.length === 0) {
      console.error("No tweets to post.");
      return NextResponse.json({ success: false, error: "No tweets to post" }, { status: 400 });
    }

    console.log("Posting thread to Twitter...");
    const thread = await client.v2.tweetThread(preparedTweets);
    console.log("Thread posted successfully!");

    return NextResponse.json({ success: true,thread});

  } catch (error) {
    console.error("Error posting thread:", error);
    return NextResponse.json({ success: false, error: "Failed to post thread" }, { status: 500 });
  }
}
