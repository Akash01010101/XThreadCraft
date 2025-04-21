
import { NextResponse } from "next/server";
import { TwitterApi, SendTweetV2Params } from "twitter-api-v2";

// Function to create a Twitter API client dynamically for each user
async function getTwitterClient(userAccessToken: string, userAccessSecret: string): Promise<TwitterApi> {
  if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
    throw new Error('Twitter API credentials are not configured');
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

    const formData = await request.formData();
    console.log("FormData parsed:", formData);

    // Extract user authentication tokens
    const userAccessToken = formData.get("userAccessToken") as string;
    const userAccessSecret = formData.get("userAccessSecret") as string;

    if (!userAccessToken || !userAccessSecret) {
      console.error("Missing user credentials");
      return NextResponse.json({ success: false, error: "Missing user credentials" }, { status: 400 });
    }

    console.log("User credentials received, initializing Twitter API client...");

    // Create a Twitter client for the authenticated user
    const client = await getTwitterClient(userAccessToken, userAccessSecret);
    console.log("Twitter API client initialized.");

    // Extract tweets dynamically
    const tweets: SendTweetV2Params[] = [];
    let i = 0;

    while (formData.has(`tweets[${i}][content]`)) {
      const tweetText = formData.get(`tweets[${i}][content]`);
      if (!tweetText || typeof tweetText !== 'string') continue;

      const tweet: SendTweetV2Params = { text: tweetText };
      const imageFile = formData.get(`tweets[${i}][imageFile]`);

      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        try {
          console.log(`Uploading image for tweet ${i}...`);
          const buffer = Buffer.from(await imageFile.arrayBuffer());
          const mediaId = await client.v1.uploadMedia(buffer, { mimeType: imageFile.type });
          tweet.media = { media_ids: [mediaId] as [string] };
          console.log(`Image uploaded successfully for tweet ${i}: ${mediaId}`);
        } catch (mediaError) {
          console.error(`Error uploading image for tweet ${i}:`, mediaError);
        }
      }
      tweets.push(tweet);
      i++;
    }

    console.log("Total tweets to post:", tweets.length);
    if (tweets.length === 0) {
      console.error("No tweets to post.");
      return NextResponse.json({ success: false, error: "No tweets to post" }, { status: 400 });
    }

    console.log("Posting thread to Twitter...");
    const thread = await client.v2.tweetThread(tweets);
    console.log("Thread posted successfully!", thread);

    return NextResponse.json({ success: true, thread });

  } catch (error) {
    console.error("Error posting thread:", error);
    return NextResponse.json({ success: false, error: "Failed to post thread" }, { status: 500 });
  }
}
