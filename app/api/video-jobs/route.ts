import { NextRequest, NextResponse } from 'next/server'
import { getVideoJob, createVideoJob, updateVideoJob, initDatabase } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('id')

  if (!jobId) {
    return NextResponse.json(
      { error: 'Job ID is required' },
      { status: 400 }
    )
  }

  try {
    const job = await getVideoJob(jobId)
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error('Error getting video job:', error)
    return NextResponse.json(
      { error: 'Failed to get job status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize database on first use
    await initDatabase()

    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    const imageFile = formData.get('image') as File | null

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Input image is required' },
        { status: 400 }
      )
    }

    // Create a new job
    const jobId = Date.now().toString() + Math.random().toString(36).substr(2, 9)

    const created = await createVideoJob(jobId, prompt)
    if (!created) {
      return NextResponse.json(
        { error: 'Failed to create job' },
        { status: 500 }
      )
    }

    // Start video generation asynchronously (don't await)
    processVideoGeneration(jobId, prompt, imageFile)

    // Return job ID immediately
    return NextResponse.json({
      jobId,
      status: 'pending',
      message: 'Video generation job started'
    })

  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create video generation job' },
      { status: 500 }
    )
  }
}

async function processVideoGeneration(jobId: string, prompt: string, imageFile: File) {
  try {
    // Update job status to processing
    await updateVideoJob(jobId, 'processing', 10)

    const { HfInference } = await import('@huggingface/inference')
    const apiKey = process.env.HF_TOKEN

    if (!apiKey) {
      await updateVideoJob(jobId, 'failed', undefined, undefined, 'Hugging Face API key not configured')
      return
    }

    const client = new HfInference(apiKey)

    // Convert image file to blob
    const imageBuffer = await imageFile.arrayBuffer()
    const imageBlob = new Blob([imageBuffer], { type: imageFile.type })

    await updateVideoJob(jobId, 'processing', 30)

    console.log(`Processing video generation for job ${jobId}`)

    // Call HuggingFace API
    const video = await client.imageToVideo({
      inputs: imageBlob,
      model: "chetwinlow1/Ovi",
      parameters: {
        prompt: prompt,
      }
    })

    await updateVideoJob(jobId, 'processing', 80)

    // Convert video to base64
    const videoBuffer = await (video as any).arrayBuffer()
    const base64Video = Buffer.from(videoBuffer).toString('base64')
    const videoDataUrl = `data:video/mp4;base64,${base64Video}`

    // Job completed successfully
    await updateVideoJob(jobId, 'completed', 100, videoDataUrl)

    console.log(`Video generation completed for job ${jobId}`)

  } catch (error: any) {
    console.error(`Video generation failed for job ${jobId}:`, error)
    await updateVideoJob(jobId, 'failed', undefined, undefined, error.message || 'Unknown error occurred')
  }
}