import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

import { ApiResponseError } from "twitter-api-v2";

// Type guard for Twitter API errors
function isRateLimitError(error: unknown): error is ApiResponseError {
  return error instanceof ApiResponseError && error.code === 429;
}

export async function DELETE(request: Request) {
  try {
    const { tweetId } = await request.json();
    const authHeader = request.headers.get("Authorization");
    const accessSecret = request.headers.get("X-Access-Secret");

    if (!authHeader || !accessSecret) {
      return NextResponse.json(
        { error: "Missing authentication tokens" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.split(" ")[1];
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken,
      accessSecret,
    });

    await client.v2.deleteTweet(tweetId);

    return NextResponse.json({
      success: true,
      message: "Tweet deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting tweet:", error);

    if (isRateLimitError(error)) {
      const resetTime = error.rateLimit?.reset ? new Date(error.rateLimit.reset * 1000) : new Date(Date.now() + 60000);
      const waitTime = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
      console.warn(`Rate limit exceeded. Wait ${waitTime} seconds before retrying.`);
      return NextResponse.json(
        { 
          error: "Rate limit exceeded",
          waitTime: waitTime * 1000,
          resetTime: resetTime.toISOString(),
          details: error.data?.errors ?? []
        },
        { status: 429 }
      );
    }

    if (error instanceof ApiResponseError) {
      return NextResponse.json(
        { error: "Twitter API error", details: error.data?.errors ?? [] },
        { status: error.code }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete tweet", details: [{ message: "An unexpected error occurred" }] },
      { status: 500 }
    );
  }
}
