import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

// Type guard for Twitter API errors
function isRateLimitError(error: unknown): error is { code: number; rateLimit?: { reset: number } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 429
  );
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
      const resetTime = error.rateLimit?.reset;
      const waitTime = resetTime ? resetTime * 1000 - Date.now() : 60000; // Default to 1 minute if no reset time
      return NextResponse.json(
        { 
          error: "Rate limit exceeded",
          waitTime,
          resetTime: resetTime ? new Date(resetTime * 1000).toISOString() : undefined
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete tweet" },
      { status: 500 }
    );
  }
}
