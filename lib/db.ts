import { Pool } from 'pg'
import { VideoSubmission } from './video-utils'

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Initialize database table
export async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        creator_name VARCHAR(255),
        contact_email VARCHAR(255) NOT NULL,
        video_url TEXT NOT NULL,
        source_type VARCHAR(50),
        embed_url TEXT,
        thumbnail_url TEXT,
        duration VARCHAR(100),
        twitter VARCHAR(255),
        instagram VARCHAR(255),
        website TEXT,
        additional_notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP,
        admin_notes TEXT,
        cloudinary_public_id VARCHAR(500),
        cloudinary_url TEXT,
        file_size INTEGER,
        video_format VARCHAR(50)
      )
    `)

    // Create video views tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS video_views (
        id SERIAL PRIMARY KEY,
        video_path VARCHAR(500) NOT NULL,
        video_title VARCHAR(500),
        view_count INTEGER DEFAULT 0,
        last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(video_path)
      )
    `)

    // Create individual view logs for analytics
    await pool.query(`
      CREATE TABLE IF NOT EXISTS view_logs (
        id SERIAL PRIMARY KEY,
        video_path VARCHAR(500) NOT NULL,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        session_id VARCHAR(255),
        user_agent TEXT,
        ip_hash VARCHAR(64)
      )
    `)

    console.log('Database initialized')
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}

// Get all submissions
export async function getSubmissions(): Promise<VideoSubmission[]> {
  try {
    const result = await pool.query(
      'SELECT * FROM submissions ORDER BY submitted_at DESC'
    )

    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      creatorName: row.creator_name,
      contactEmail: row.contact_email,
      videoUrl: row.video_url,
      sourceType: row.source_type as any,
      embedUrl: row.embed_url,
      thumbnailUrl: row.thumbnail_url,
      duration: row.duration,
      socialMedia: {
        twitter: row.twitter,
        instagram: row.instagram,
        website: row.website
      },
      additionalNotes: row.additional_notes,
      status: row.status as any,
      submittedAt: row.submitted_at,
      reviewedAt: row.reviewed_at,
      adminNotes: row.admin_notes
    }))
  } catch (error) {
    console.error('Failed to get submissions:', error)
    return []
  }
}

// Create submission
export async function createSubmission(submission: VideoSubmission): Promise<boolean> {
  try {
    await pool.query(
      `INSERT INTO submissions (
        id, title, description, category, creator_name,
        contact_email, video_url, source_type, embed_url,
        thumbnail_url, duration, twitter, instagram, website,
        additional_notes, status, submitted_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
      [
        submission.id,
        submission.title,
        submission.description,
        submission.category,
        submission.creatorName,
        submission.contactEmail,
        submission.videoUrl,
        submission.sourceType,
        submission.embedUrl,
        submission.thumbnailUrl,
        submission.duration,
        submission.socialMedia?.twitter,
        submission.socialMedia?.instagram,
        submission.socialMedia?.website,
        submission.additionalNotes,
        submission.status,
        submission.submittedAt
      ]
    )
    return true
  } catch (error) {
    console.error('Failed to create submission:', error)
    return false
  }
}

// Update submission status
export async function updateSubmissionStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  adminNotes?: string
): Promise<boolean> {
  try {
    await pool.query(
      `UPDATE submissions
       SET status = $1, admin_notes = $2, reviewed_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [status, adminNotes, id]
    )
    return true
  } catch (error) {
    console.error('Failed to update submission:', error)
    return false
  }
}

// Get submission by ID
export async function getSubmissionById(id: string): Promise<VideoSubmission | null> {
  try {
    const result = await pool.query(
      'SELECT * FROM submissions WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      creatorName: row.creator_name,
      contactEmail: row.contact_email,
      videoUrl: row.video_url,
      sourceType: row.source_type as any,
      embedUrl: row.embed_url,
      thumbnailUrl: row.thumbnail_url,
      duration: row.duration,
      socialMedia: {
        twitter: row.twitter,
        instagram: row.instagram,
        website: row.website
      },
      additionalNotes: row.additional_notes,
      status: row.status as any,
      submittedAt: row.submitted_at,
      reviewedAt: row.reviewed_at,
      adminNotes: row.admin_notes
    }
  } catch (error) {
    console.error('Failed to get submission by ID:', error)
    return null
  }
}

// Track video view
export async function trackVideoView(
  videoPath: string,
  videoTitle?: string,
  sessionId?: string,
  userAgent?: string,
  ipHash?: string
): Promise<boolean> {
  try {
    // Log individual view
    await pool.query(
      `INSERT INTO view_logs (video_path, session_id, user_agent, ip_hash)
       VALUES ($1, $2, $3, $4)`,
      [videoPath, sessionId, userAgent, ipHash]
    )

    // Update or insert video view count
    await pool.query(
      `INSERT INTO video_views (video_path, video_title, view_count, last_viewed)
       VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
       ON CONFLICT (video_path)
       DO UPDATE SET
         view_count = video_views.view_count + 1,
         last_viewed = CURRENT_TIMESTAMP,
         video_title = COALESCE($2, video_views.video_title)`,
      [videoPath, videoTitle]
    )

    return true
  } catch (error) {
    console.error('Failed to track video view:', error)
    return false
  }
}

// Get video view count
export async function getVideoViewCount(videoPath: string): Promise<number> {
  try {
    const result = await pool.query(
      'SELECT view_count FROM video_views WHERE video_path = $1',
      [videoPath]
    )

    if (result.rows.length === 0) return 0
    return result.rows[0].view_count || 0
  } catch (error) {
    console.error('Failed to get video view count:', error)
    return 0
  }
}

// Get all video views
export async function getAllVideoViews(): Promise<{ [videoPath: string]: number }> {
  try {
    const result = await pool.query(
      'SELECT video_path, view_count FROM video_views'
    )

    const viewCounts: { [videoPath: string]: number } = {}
    result.rows.forEach(row => {
      viewCounts[row.video_path] = row.view_count || 0
    })

    return viewCounts
  } catch (error) {
    console.error('Failed to get all video views:', error)
    return {}
  }
}

// Get top viewed videos
export async function getTopViewedVideos(limit: number = 10): Promise<Array<{ videoPath: string, videoTitle: string, viewCount: number }>> {
  try {
    const result = await pool.query(
      'SELECT video_path, video_title, view_count FROM video_views ORDER BY view_count DESC LIMIT $1',
      [limit]
    )

    return result.rows.map(row => ({
      videoPath: row.video_path,
      videoTitle: row.video_title || 'Unknown',
      viewCount: row.view_count || 0
    }))
  } catch (error) {
    console.error('Failed to get top viewed videos:', error)
    return []
  }
}