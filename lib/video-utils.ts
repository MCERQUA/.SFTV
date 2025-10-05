export type VideoSourceType =
  | 'youtube'
  | 'vimeo'
  | 'direct'
  | 'google-drive'
  | 'dropbox'
  | 'streamable'
  | 'other'

export interface VideoSubmission {
  id: string
  title: string
  description: string
  category: string
  creatorName: string
  contactEmail: string
  videoUrl: string
  sourceType: VideoSourceType
  embedUrl?: string
  thumbnailUrl?: string
  duration?: string
  socialMedia?: {
    twitter?: string
    instagram?: string
    website?: string
  }
  additionalNotes?: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  adminNotes?: string
}

export function detectVideoSource(url: string): VideoSourceType {
  if (!url) return 'other'

  const urlLower = url.toLowerCase()

  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube'
  }
  if (urlLower.includes('vimeo.com')) {
    return 'vimeo'
  }
  if (urlLower.includes('drive.google.com')) {
    return 'google-drive'
  }
  if (urlLower.includes('dropbox.com')) {
    return 'dropbox'
  }
  if (urlLower.includes('streamable.com')) {
    return 'streamable'
  }
  if (urlLower.match(/\.(mp4|webm|ogg|mov)$/)) {
    return 'direct'
  }

  return 'other'
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

export function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

export function getEmbedUrl(url: string, sourceType: VideoSourceType): string {
  switch (sourceType) {
    case 'youtube':
      const youtubeId = extractYouTubeId(url)
      return youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : url

    case 'vimeo':
      const vimeoId = extractVimeoId(url)
      return vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : url

    case 'streamable':
      const streamableMatch = url.match(/streamable\.com\/([^\/]+)/)
      return streamableMatch ? `https://streamable.com/e/${streamableMatch[1]}` : url

    case 'google-drive':
      const driveMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
      return driveMatch ? `https://drive.google.com/file/d/${driveMatch[1]}/preview` : url

    default:
      return url
  }
}

export function getThumbnailUrl(url: string, sourceType: VideoSourceType): string | null {
  switch (sourceType) {
    case 'youtube':
      const youtubeId = extractYouTubeId(url)
      return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null

    case 'vimeo':
      return null

    default:
      return null
  }
}

export const videoCategories = [
  { value: 'commercial-short', label: 'Commercial Short (Under 60s)' },
  { value: 'commercial-long', label: 'Commercial (Over 60s)' },
  { value: 'music-video', label: 'Music Video Commercial' },
  { value: 'funny-clip', label: 'Funny Clip' },
  { value: 'educational', label: 'Educational Content' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'testimonial', label: 'Customer Testimonial' },
  { value: 'other', label: 'Other' }
]