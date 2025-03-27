import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Type guard for Twitter API errors
function isRateLimitError(error: unknown): error is { code: number; rateLimit?: { reset: number } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 429
  );
}

async function deleteWithRetry(
  client: TwitterApi,
  tweetId: string,
  retryCount = 0
): Promise<{ success: boolean; retryInfo?: { attempt: number; waitTime: number } }> {
  try {
    await client.v2.deleteTweet(tweetId);
    return { success: true };
  } catch (error) {
    if (isRateLimitError(error) && retryCount < MAX_RETRIES) {
      const resetTime = error.rateLimit?.reset;
      const waitTime = resetTime
        ? resetTime * 1000 - Date.now()
        : INITIAL_RETRY_DELAY * Math.pow(2, retryCount);

      console.log(
        `Rate limited. Retrying in ${waitTime}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`
      );

      await wait(waitTime);
      return deleteWithRetry(client, tweetId, retryCount + 1);
    }
    throw error;
  }
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

    const result = await deleteWithRetry(client, tweetId);

    return NextResponse.json({
      success: true,
      message: result.retryInfo
        ? `Tweet deleted successfully after ${result.retryInfo.attempt} attempts`
        : "Tweet deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tweet:", error);

    if (isRateLimitError(error)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete tweet" },
      { status: 500 }
    );
  }
}
