import { NextResponse } from 'next/server'
import { TwitterApi } from 'twitter-api-v2'

export async function DELETE(request: Request) {
  try {
    const { tweetId } = await request.json()
    const authHeader = request.headers.get('Authorization')
    const accessSecret = request.headers.get('X-Access-Secret')

    if (!authHeader || !accessSecret) {
      return NextResponse.json(
        { error: 'Missing authentication tokens' },
        { status: 401 }
      )
    }

    const accessToken = authHeader.split(' ')[1]
    const client = new TwitterApi({ appKey: process.env.TWITTER_API_KEY!, appSecret: process.env.TWITTER_API_SECRET!, accessToken, accessSecret })

    await client.v2.deleteTweet(tweetId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tweet:', error)
    return NextResponse.json(
      { error: 'Failed to delete tweet' },
      { status: 500 }
    )
  }
}

