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
        admin_notes TEXT
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