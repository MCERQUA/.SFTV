import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

export async function POST(request: NextRequest) {
  try {
    console.log('API route called - processing request...')
    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    const imageFile = formData.get('image') as File | null

    console.log('Received prompt:', prompt)
    console.log('Received image file:', imageFile ? 'Yes' : 'No')

    if (!prompt) {
      console.log('Error: No prompt provided')
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!imageFile) {
      console.log('Error: No image file provided')
      return NextResponse.json(
        { error: 'Input image is required' },
        { status: 400 }
      )
    }

    // Check for Hugging Face API key
    const apiKey = process.env.HF_TOKEN
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Hugging Face API key not configured. Please set HF_TOKEN environment variable.' },
        { status: 500 }
      )
    }

    // Initialize InferenceClient with fal-ai provider
    const client = new HfInference(apiKey)

    // Convert image file to blob/buffer for HuggingFace
    console.log('Converting image file...')
    const imageBuffer = await imageFile.arrayBuffer()
    const imageBlob = new Blob([imageBuffer], { type: imageFile.type })

    try {
      // Use the Ovi model for image-to-video generation via fal-ai provider
      console.log('Calling HuggingFace API...')

      // Set a timeout for the API call (4 minutes max)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out - video generation is taking longer than expected')), 240000)
      })

      const apiCallPromise = client.imageToVideo({
        inputs: imageBlob,
        model: "chetwinlow1/Ovi",
        parameters: {
          prompt: prompt,
        }
      })

      const video = await Promise.race([apiCallPromise, timeoutPromise])

      // Convert video blob to base64 for response
      const videoBuffer = await (video as any).arrayBuffer()
      const base64Video = Buffer.from(videoBuffer).toString('base64')
      const videoDataUrl = `data:video/mp4;base64,${base64Video}`

      console.log('Video generated successfully')
      return NextResponse.json({
        success: true,
        videoUrl: videoDataUrl,
        message: 'Video generated successfully'
      })

    } catch (inferenceError: any) {
      console.error('Hugging Face inference error:', inferenceError)

      // Handle timeout specifically
      if (inferenceError.message?.includes('timed out')) {
        return NextResponse.json(
          { error: 'Video generation is taking longer than expected. The model might be busy - please try again in a few minutes.' },
          { status: 408 }
        )
      }

      // Handle common error states
      if (inferenceError.message?.includes('503') || inferenceError.message?.includes('loading')) {
        return NextResponse.json(
          { error: 'Model is loading, please try again in a few minutes' },
          { status: 503 }
        )
      }

      if (inferenceError.message?.includes('429') || inferenceError.message?.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded, please try again later' },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: `Failed to generate video: ${inferenceError.message}` },
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