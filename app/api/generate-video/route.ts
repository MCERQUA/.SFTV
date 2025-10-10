import { NextRequest, NextResponse } from 'next/server'

// Temporary in-memory storage as fallback
const tempJobs = new Map<string, {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: string
  error?: string
  createdAt: Date
}>()

export async function POST(request: NextRequest) {
  try {
    console.log('Starting video generation...')

    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    const imageFile = formData.get('image') as File | null

    console.log('Received prompt:', prompt)
    console.log('Received image file:', imageFile ? 'Yes' : 'No')

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

    // For now, try direct generation instead of async to avoid database issues
    console.log('Starting direct video generation...')

    try {
      const { InferenceClient } = await import('@huggingface/inference')
      const apiKey = process.env.HF_TOKEN

      if (!apiKey) {
        return NextResponse.json(
          { error: 'Hugging Face API key not configured' },
          { status: 500 }
        )
      }

      const client = new InferenceClient(apiKey)

      // Convert image file to buffer for Ovi (raw buffer like fs.readFileSync)
      const imageBuffer = await imageFile.arrayBuffer()
      const imageData = Buffer.from(imageBuffer)

      console.log('Calling HuggingFace API with Ovi model...')

      // Call HuggingFace API with timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Generation timeout - taking too long')), 30000) // 30 second timeout for testing
      })

      const apiCallPromise = client.imageToVideo({
        provider: "fal-ai",
        model: "chetwinlow1/Ovi",
        inputs: imageData,
        parameters: {
          prompt: prompt,
        }
      })

      const video = await Promise.race([apiCallPromise, timeoutPromise])

      // Convert video to base64
      const videoBuffer = await (video as any).arrayBuffer()
      const base64Video = Buffer.from(videoBuffer).toString('base64')
      const videoDataUrl = `data:video/mp4;base64,${base64Video}`

      console.log('Video generated successfully')

      return NextResponse.json({
        success: true,
        videoUrl: videoDataUrl,
        message: 'Video generated successfully'
      })

    } catch (hfError: any) {
      console.error('HuggingFace error:', hfError)

      if (hfError.message?.includes('timeout')) {
        // If timeout, create async job
        const jobId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        console.log('Creating async job due to timeout:', jobId)

        tempJobs.set(jobId, {
          id: jobId,
          status: 'pending',
          progress: 0,
          createdAt: new Date()
        })

        // Start background processing
        processVideoGenerationAsync(jobId, prompt, imageFile)

        return NextResponse.json({
          async: true,
          jobId: jobId,
          status: 'pending',
          message: 'Video generation is taking longer - processing in background'
        })
      }

      return NextResponse.json(
        { error: `Failed to generate video: ${hfError.message}` },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error during video generation' },
      { status: 500 }
    )
  }
}

async function processVideoGenerationAsync(jobId: string, prompt: string, imageFile: File) {
  try {
    // Update job status to processing
    const job = tempJobs.get(jobId)
    if (job) {
      job.status = 'processing'
      job.progress = 10
      tempJobs.set(jobId, job)
    }

    const { InferenceClient } = await import('@huggingface/inference')
    const apiKey = process.env.HF_TOKEN

    if (!apiKey) {
      const job = tempJobs.get(jobId)
      if (job) {
        job.status = 'failed'
        job.error = 'Hugging Face API key not configured'
        tempJobs.set(jobId, job)
      }
      return
    }

    const client = new InferenceClient(apiKey)

    // Convert image file to buffer for Ovi (raw buffer like fs.readFileSync)
    const imageBuffer = await imageFile.arrayBuffer()
    const imageData = Buffer.from(imageBuffer)

    const job2 = tempJobs.get(jobId)
    if (job2) {
      job2.progress = 30
      tempJobs.set(jobId, job2)
    }

    console.log(`Processing video generation for job ${jobId}`)

    // Call HuggingFace API
    const video = await client.imageToVideo({
      provider: "fal-ai",
      model: "chetwinlow1/Ovi",
      inputs: imageData,
      parameters: {
        prompt: prompt,
      }
    })

    const job3 = tempJobs.get(jobId)
    if (job3) {
      job3.progress = 80
      tempJobs.set(jobId, job3)
    }

    // Convert video to base64
    const videoBuffer = await (video as any).arrayBuffer()
    const base64Video = Buffer.from(videoBuffer).toString('base64')
    const videoDataUrl = `data:video/mp4;base64,${base64Video}`

    // Job completed successfully
    const finalJob = tempJobs.get(jobId)
    if (finalJob) {
      finalJob.status = 'completed'
      finalJob.progress = 100
      finalJob.result = videoDataUrl
      tempJobs.set(jobId, finalJob)
    }

    console.log(`Video generation completed for job ${jobId}`)

  } catch (error: any) {
    console.error(`Video generation failed for job ${jobId}:`, error)
    const job = tempJobs.get(jobId)
    if (job) {
      job.status = 'failed'
      job.error = error.message || 'Unknown error occurred'
      tempJobs.set(jobId, job)
    }
  }
}

// Export temp jobs for access from video-jobs route
export { tempJobs }