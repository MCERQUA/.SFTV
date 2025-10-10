import { NextRequest, NextResponse } from 'next/server'

// In-memory job storage (in production, use Redis or database)
const jobs = new Map<string, {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: string
  error?: string
  createdAt: Date
  updatedAt: Date
}>()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('id')

  if (!jobId) {
    return NextResponse.json(
      { error: 'Job ID is required' },
      { status: 400 }
    )
  }

  const job = jobs.get(jobId)
  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(job)
}

export async function POST(request: NextRequest) {
  try {
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
    const job = {
      id: jobId,
      status: 'pending' as const,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    jobs.set(jobId, job)

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
  const job = jobs.get(jobId)
  if (!job) return

  try {
    // Update job status to processing
    job.status = 'processing'
    job.progress = 10
    job.updatedAt = new Date()
    jobs.set(jobId, job)

    const { HfInference } = await import('@huggingface/inference')
    const apiKey = process.env.HF_TOKEN

    if (!apiKey) {
      job.status = 'failed'
      job.error = 'Hugging Face API key not configured'
      job.updatedAt = new Date()
      jobs.set(jobId, job)
      return
    }

    const client = new HfInference(apiKey)

    // Convert image file to blob
    const imageBuffer = await imageFile.arrayBuffer()
    const imageBlob = new Blob([imageBuffer], { type: imageFile.type })

    job.progress = 30
    job.updatedAt = new Date()
    jobs.set(jobId, job)

    console.log(`Processing video generation for job ${jobId}`)

    // Call HuggingFace API
    const video = await client.imageToVideo({
      inputs: imageBlob,
      model: "chetwinlow1/Ovi",
      parameters: {
        prompt: prompt,
      }
    })

    job.progress = 80
    job.updatedAt = new Date()
    jobs.set(jobId, job)

    // Convert video to base64
    const videoBuffer = await (video as any).arrayBuffer()
    const base64Video = Buffer.from(videoBuffer).toString('base64')
    const videoDataUrl = `data:video/mp4;base64,${base64Video}`

    // Job completed successfully
    job.status = 'completed'
    job.progress = 100
    job.result = videoDataUrl
    job.updatedAt = new Date()
    jobs.set(jobId, job)

    console.log(`Video generation completed for job ${jobId}`)

  } catch (error: any) {
    console.error(`Video generation failed for job ${jobId}:`, error)

    const job = jobs.get(jobId)
    if (job) {
      job.status = 'failed'
      job.error = error.message || 'Unknown error occurred'
      job.updatedAt = new Date()
      jobs.set(jobId, job)
    }
  }
}