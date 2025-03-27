import { type NextRequest, NextResponse } from "next/server"
import { TwitterApi, ApiResponseError } from "twitter-api-v2"

const getTwitterClient = (userAccessToken: string, userAccessSecret: string): TwitterApi => {
  const appKey = process.env.TWITTER_API_KEY
  const appSecret = process.env.TWITTER_API_SECRET

  if (!appKey || !appSecret) {
    console.error("Missing Twitter API credentials")
    throw new Error("Twitter API credentials not configured")
  }

  return new TwitterApi({
    appKey,
    appSecret,
    accessToken: userAccessToken,
    accessSecret: userAccessSecret,
  })
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const timeframeParam = request.nextUrl.searchParams.get("timeframe") || "3"
    const timeframe = parseInt(timeframeParam, 10)

    if (isNaN(timeframe) || timeframe <= 0) {
      return NextResponse.json({ error: "Invalid timeframe" }, { status: 400 })
    }

    const authHeader = request.headers.get("Authorization")
    const userAccessToken = authHeader?.split(" ")[1] || null
    const userAccessSecret = request.headers.get("X-Access-Secret")

    if (!userAccessToken || !userAccessSecret) {
      return NextResponse.json({ error: "Missing user credentials" }, { status: 400 })
    }

    const client = getTwitterClient(userAccessToken, userAccessSecret)
    const me = await client.v2.me()

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - timeframe)
    const startTimeISO = startDate.toISOString()

    const tweets = await client.v2.userTimeline(me.data.id, {
      max_results: 100,
      "tweet.fields": ["created_at", "public_metrics"],
      start_time: startTimeISO,
    })

    return NextResponse.json({ tweets: tweets.data.data ?? [] })
  } catch (error: unknown) {
    console.error("Error fetching tweets:", error)

    if (error instanceof ApiResponseError) {
      if (error.rateLimit?.reset) {
        const resetTime = new Date(error.rateLimit.reset * 1000)
        const waitTime = Math.ceil((resetTime.getTime() - Date.now()) / 1000)
        console.warn(`Rate limit exceeded. Wait ${waitTime} seconds before retrying.`)
      }

      return NextResponse.json(
        { error: "Twitter API error", details: error.data?.errors ?? [] },
        { status: error.code }
      )
    }

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    )
  }
}
