import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

interface TempJob {
  id: string
  status: JobStatus
  progress: number
  result?: string
  blobKey?: string
  videoData?: string
  mimeType?: string
  error?: string
  createdAt: Date
  updatedAt: Date
}

// Temporary in-memory storage as fallback for queued jobs when database access
// is unavailable in the serverless environment
const tempJobs = new Map<string, TempJob>()

function generateJobId(): string {
  try {
    return randomUUID()
  } catch (error) {
    // Fallback for runtimes where randomUUID is unavailable
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  }
}

function updateJob(jobId: string, updates: Partial<Omit<TempJob, 'id' | 'createdAt'>>): TempJob | undefined {
  const job = tempJobs.get(jobId)
  if (!job) {
    return undefined
  }

  const updatedJob: TempJob = {
    ...job,
    ...updates,
    updatedAt: new Date(),
  }

  tempJobs.set(jobId, updatedJob)
  return updatedJob
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('Starting video generation...')

    const formData = await request.formData()
    const prompt = (formData.get('prompt') as string | null)?.trim() ?? ''
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

    const imageArrayBuffer = await imageFile.arrayBuffer()
    const imageMimeType = imageFile.type || 'image/png'

    if (imageArrayBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'Uploaded image is empty' },
        { status: 400 }
      )
    }

    // Create a background job immediately so we can return to the client before
    // the expensive Hugging Face request completes (Netlify has a ~26s limit).
    const jobId = generateJobId()
    const now = new Date()

    tempJobs.set(jobId, {
      id: jobId,
      status: 'pending',
      progress: 0,
      createdAt: now,
      updatedAt: now,
    })

    console.log('Queued video generation job:', jobId)

    // Fire and forget the background processing – any errors will be persisted
    // to the in-memory job map and surfaced through the polling endpoint.
    void processVideoGenerationAsync(jobId, prompt, imageArrayBuffer, imageMimeType)

    return NextResponse.json({
      async: true,
      jobId,
      status: 'pending' as JobStatus,
      message: 'Video generation job queued. Check status for progress updates.'
    })

  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error during video generation' },
      { status: 500 }
    )
  }
}

async function processVideoGenerationAsync(jobId: string, prompt: string, imageArrayBuffer: ArrayBuffer, mimeType: string) {
  try {
    updateJob(jobId, { status: 'processing', progress: 10 })

    const { InferenceClient } = await import('@huggingface/inference')
    const apiKey = process.env.HF_TOKEN

    if (!apiKey) {
      updateJob(jobId, {
        status: 'failed',
        progress: 0,
        error: 'Hugging Face API key not configured',
        result: undefined,
      })
      return
    }

    const client = new InferenceClient(apiKey, { provider: 'fal-ai' })

    updateJob(jobId, { progress: 30 })

    console.log(`Processing video generation for job ${jobId}`)

    // Convert the ArrayBuffer to a Blob so the provider keeps the correct MIME type
    const imageInput = new Blob([imageArrayBuffer], { type: mimeType })

    // Call HuggingFace API
    const videoBlob = await client.imageToVideo({
      model: 'chetwinlow1/Ovi',
      provider: 'fal-ai',
      inputs: imageInput,
      parameters: {
        prompt,
        // The Ovi model expects combined text/audio tags for richer prompts.
        // If the prompt already contains custom formatting we leave it as-is.
      },
    })

    updateJob(jobId, { progress: 80 })

    // Convert video for inline playback. Some providers (like fal.ai) first
    // return a JSON payload containing a temporary download URL while others
    // stream the binary video directly. We handle both cases so the client
    // always receives a usable source.
    const videoArrayBuffer = await videoBlob.arrayBuffer()
    const detectedMimeType = (videoBlob.type || '').toLowerCase()

    if (videoArrayBuffer.byteLength === 0) {
      throw new Error('Received empty video data from provider')
    }

    const isJsonPayload = detectedMimeType.includes('application/json') || detectedMimeType.includes('text/plain')

    if (isJsonPayload) {
      const payloadText = new TextDecoder().decode(videoArrayBuffer)

      try {
        const payload = JSON.parse(payloadText)
        const candidateUrls: unknown[] = [
          payload?.video?.url,
          payload?.data?.video?.url,
          payload?.output?.video?.url,
          payload?.result?.video?.url,
          Array.isArray(payload?.results) ? payload.results[0]?.video?.url : undefined,
        ]

        const resolvedUrl = candidateUrls.find((value): value is string => typeof value === 'string' && value.startsWith('http'))

        if (resolvedUrl) {
          const remoteResponse = await fetch(resolvedUrl)

          if (!remoteResponse.ok) {
            throw new Error(`Failed to download video from provider (status ${remoteResponse.status})`)
          }

          const remoteArrayBuffer = await remoteResponse.arrayBuffer()

          if (remoteArrayBuffer.byteLength === 0) {
            throw new Error('Downloaded video data from provider was empty')
          }

          // Try to store video in Netlify Blobs, fallback to in-memory
          let storeSuccess = false
          const videoUrl = `/api/video-blob/${jobId}`

          // First try Netlify Blobs storage
          try {
            // Check if we're in Netlify environment before importing
            if (process.env.NETLIFY) {
              const { getStore } = await import('@netlify/blobs')
              const videoStore = getStore('ai-videos')
              const videoKey = `video-${jobId}.webm`

              await videoStore.set(videoKey, remoteArrayBuffer)

              updateJob(jobId, {
                status: 'completed',
                progress: 100,
                result: videoUrl,
                blobKey: videoKey,
                error: undefined,
              })

              storeSuccess = true
              console.log(`Video stored in Netlify Blobs for job ${jobId}`)
            }
          } catch (blobError) {
            console.warn('Failed to store in Netlify Blobs, using fallback:', blobError.message)
          }

          // Fallback to in-memory storage if Netlify Blobs failed
          if (!storeSuccess) {
            const base64Video = Buffer.from(remoteArrayBuffer).toString('base64')
            const remoteMimeType = remoteResponse.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() || 'video/mp4'

            updateJob(jobId, {
              status: 'completed',
              progress: 100,
              result: videoUrl,
              videoData: base64Video,
              mimeType: remoteMimeType,
              error: undefined,
            })

            console.log(`Video stored in memory for job ${jobId}`)
          }

          console.log(`Video generation completed for job ${jobId} (saved to blob endpoint)`)
          return
        }

        console.error(`Video provider returned unexpected JSON payload for job ${jobId}:`, payload)
        throw new Error('Video provider returned an unexpected response format')
      } catch (parseError) {
        console.error(`Failed to parse JSON video payload for job ${jobId}:`, parseError)
        throw new Error('Unable to parse video response from provider')
      }
    }

    // Handle direct video binary response
    // Try to store video in Netlify Blobs, fallback to in-memory
    let storeSuccess = false
    const videoUrl = `/api/video-blob/${jobId}`

    // First try Netlify Blobs storage
    try {
      // Check if we're in Netlify environment before importing
      if (process.env.NETLIFY) {
        const { getStore } = await import('@netlify/blobs')
        const videoStore = getStore('ai-videos')
        const videoKey = `video-${jobId}.webm`

        await videoStore.set(videoKey, videoArrayBuffer)

        updateJob(jobId, {
          status: 'completed',
          progress: 100,
          result: videoUrl,
          blobKey: videoKey,
          error: undefined,
        })

        storeSuccess = true
        console.log(`Video stored in Netlify Blobs for job ${jobId}`)
      }
    } catch (blobError) {
      console.warn('Failed to store in Netlify Blobs, using fallback:', blobError.message)
    }

    // Fallback to in-memory storage if Netlify Blobs failed
    if (!storeSuccess) {
      const base64Video = Buffer.from(videoArrayBuffer).toString('base64')
      const videoMimeType = detectedMimeType || 'video/mp4'

      updateJob(jobId, {
        status: 'completed',
        progress: 100,
        result: videoUrl,
        videoData: base64Video,
        mimeType: videoMimeType,
        error: undefined,
      })

      console.log(`Video stored in memory for job ${jobId}`)
    }

    console.log(`Video generation completed for job ${jobId} (saved to blob endpoint)`)

  } catch (error: any) {
    console.error(`Video generation failed for job ${jobId}:`, error)
    updateJob(jobId, {
      status: 'failed',
      progress: 0,
      error: error?.message || 'Unknown error occurred during video generation',
      result: undefined,
    })
  }
}

// Export temp jobs for access from video-jobs route
export { tempJobs }