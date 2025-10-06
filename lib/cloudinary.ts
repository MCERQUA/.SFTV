import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary - this runs on the server
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Video upload configuration
export const uploadConfig = {
  maxFileSize: 25 * 1024 * 1024, // 25MB in bytes
  acceptedFormats: ['mp4', 'webm', 'mov', 'avi', 'mkv'],
  uploadFolder: 'uploads/pending',
  approvedFolders: {
    'commercial-shorts': 'videos/commercial-shorts',
    'commercials-longer': 'videos/commercials-longer',
    'music-video-commercials': 'videos/music-video-commercials',
    'funny-clips': 'videos/funny-clips',
    'shows-cartoons': 'videos/shows-cartoons',
  }
}

// Generate signature for secure uploads
export function generateSignature(callback: string, params_to_sign: Record<string, any>) {
  const signature = cloudinary.utils.api_sign_request(
    params_to_sign,
    process.env.CLOUDINARY_API_SECRET!
  )
  return signature
}

// Move video from pending to approved folder
export async function approveVideo(
  publicId: string,
  category: string,
  newFileName?: string
) {
  const targetFolder = uploadConfig.approvedFolders[category as keyof typeof uploadConfig.approvedFolders]

  if (!targetFolder) {
    throw new Error(`Invalid category: ${category}`)
  }

  // Rename/move the asset
  const newPublicId = `${targetFolder}/${newFileName || publicId.split('/').pop()}`

  try {
    const result = await cloudinary.uploader.rename(
      publicId,
      newPublicId,
      { resource_type: 'video', invalidate: true }
    )
    return result
  } catch (error) {
    console.error('Error moving video:', error)
    throw error
  }
}

// Delete video from Cloudinary
export async function deleteVideo(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video'
    })
    return result
  } catch (error) {
    console.error('Error deleting video:', error)
    throw error
  }
}

// Get video details including thumbnail
export async function getVideoDetails(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'video',
      image_metadata: true
    })

    // Generate thumbnail URL
    const thumbnailUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      transformation: [
        { width: 1280, height: 720, crop: 'fill' },
        { quality: 'auto' },
        { format: 'jpg' },
        { offset: '10' } // 10 seconds into video
      ]
    })

    return {
      ...result,
      thumbnailUrl
    }
  } catch (error) {
    console.error('Error getting video details:', error)
    throw error
  }
}