import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Redirecting to async video generation...')

    // Forward the request to the new async job endpoint
    const formData = await request.formData()

    const jobResponse = await fetch(`${request.nextUrl.origin}/api/video-jobs`, {
      method: 'POST',
      body: formData,
    })

    if (!jobResponse.ok) {
      const errorData = await jobResponse.json()
      return NextResponse.json(errorData, { status: jobResponse.status })
    }

    const jobData = await jobResponse.json()

    return NextResponse.json({
      async: true,
      jobId: jobData.jobId,
      status: jobData.status,
      message: 'Video generation started. Use the jobId to check progress.'
    })

  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error during video generation' },
      { status: 500 }
    )
  }
}