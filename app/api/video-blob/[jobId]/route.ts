import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { jobId } = params

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Import temp jobs from generate-video route
    const { tempJobs } = await import('../../generate-video/route')

    const job = tempJobs.get(jobId)
    if (!job) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    if (job.status !== 'completed') {
      return NextResponse.json(
        { error: 'Video not ready' },
        { status: 404 }
      )
    }

    let videoBuffer: Buffer
    let mimeType = 'video/mp4'

    // Try Netlify Blobs first if blobKey exists and we're in Netlify
    if (job.blobKey && process.env.NETLIFY) {
      try {
        const { getStore } = await import('@netlify/blobs')
        const videoStore = getStore('ai-videos')

        const videoData = await videoStore.get(job.blobKey, { type: 'arrayBuffer' })
        if (videoData) {
          videoBuffer = Buffer.from(videoData)
          mimeType = job.blobKey.endsWith('.webm') ? 'video/webm' : 'video/mp4'
        } else {
          throw new Error('Video not found in blob storage')
        }
      } catch (blobError) {
        console.error('Failed to retrieve from Netlify Blobs:', blobError)

        // Fallback to in-memory storage
        if (!job.videoData) {
          return NextResponse.json(
            { error: 'Video data not available' },
            { status: 404 }
          )
        }

        videoBuffer = Buffer.from(job.videoData, 'base64')
        mimeType = job.mimeType || 'video/mp4'
      }
    } else if (job.videoData) {
      // Use in-memory fallback storage
      videoBuffer = Buffer.from(job.videoData, 'base64')
      mimeType = job.mimeType || 'video/mp4'
    } else {
      return NextResponse.json(
        { error: 'Video data not available' },
        { status: 404 }
      )
    }

    // Return video as blob response
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': videoBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Accept-Ranges': 'bytes',
      },
    })

  } catch (error) {
    console.error('Error serving video blob:', error)
    return NextResponse.json(
      { error: 'Failed to serve video' },
      { status: 500 }
    )
  }
}