import { NextRequest, NextResponse } from "next/server"
import {
  initDatabase,
  trackVideoView,
  getVideoViewCount,
  getAllVideoViews,
  getTopViewedVideos
} from "@/lib/db"
import crypto from 'crypto'

// Initialize database on first load
initDatabase()

// Helper to hash IP address for privacy
function hashIP(ip: string | null): string | undefined {
  if (!ip) return undefined
  return crypto.createHash('sha256').update(ip).digest('hex')
}

// GET: Retrieve view counts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const videoPath = searchParams.get('videoPath')
    const top = searchParams.get('top')

    // Get top viewed videos
    if (top) {
      const limit = parseInt(top) || 10
      const topVideos = await getTopViewedVideos(limit)
      return NextResponse.json({ topVideos })
    }

    // Get specific video view count
    if (videoPath) {
      const viewCount = await getVideoViewCount(videoPath)
      return NextResponse.json({ videoPath, viewCount })
    }

    // Get all video view counts
    const allViews = await getAllVideoViews()
    return NextResponse.json({ views: allViews })
  } catch (error) {
    console.error("Error in GET /api/video-views:", error)
    return NextResponse.json(
      { error: "Failed to fetch video views" },
      { status: 500 }
    )
  }
}

// POST: Track a video view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { videoPath, videoTitle } = body

    if (!videoPath) {
      return NextResponse.json(
        { error: "Video path is required" },
        { status: 400 }
      )
    }

    // Get session and user info
    const sessionId = request.cookies.get('session_id')?.value ||
                     `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const userAgent = request.headers.get('user-agent') || undefined
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               null
    const ipHash = hashIP(ip)

    // Track the view
    const success = await trackVideoView(
      videoPath,
      videoTitle,
      sessionId,
      userAgent,
      ipHash
    )

    if (!success) {
      throw new Error("Failed to track video view")
    }

    // Get updated view count
    const viewCount = await getVideoViewCount(videoPath)

    // Set session cookie if new
    const response = NextResponse.json(
      { message: "View tracked", viewCount },
      { status: 200 }
    )

    if (!request.cookies.get('session_id')) {
      response.cookies.set('session_id', sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax'
      })
    }

    return response
  } catch (error) {
    console.error("Error in POST /api/video-views:", error)
    return NextResponse.json(
      { error: "Failed to track video view" },
      { status: 500 }
    )
  }
}