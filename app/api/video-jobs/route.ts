import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('id')

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Try to import temp jobs from generate-video route
    const { tempJobs } = await import('../generate-video/route')

    const job = tempJobs.get(jobId)
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: job.id,
      status: job.status,
      progress: job.progress,
      result: job.result,
      error: job.error,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    })
  } catch (error) {
    console.error('Error getting video job:', error)
    return NextResponse.json(
      { error: 'Failed to get job status' },
      { status: 500 }
    )
  }
}

// Remove POST method since video generation is handled by /api/generate-video
// This route only handles status polling via GET