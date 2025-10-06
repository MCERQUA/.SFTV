import { Handler } from '@netlify/functions'
import { Pool } from 'pg'

// Create connection pool
const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Initialize database table
async function initDatabase() {
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

    // Add new columns if they don't exist (for existing databases)
    // Try adding each column individually to avoid failing if some already exist
    const columnsToAdd = [
      'ALTER TABLE submissions ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(500)',
      'ALTER TABLE submissions ADD COLUMN IF NOT EXISTS cloudinary_url TEXT',
      'ALTER TABLE submissions ADD COLUMN IF NOT EXISTS file_size INTEGER',
      'ALTER TABLE submissions ADD COLUMN IF NOT EXISTS video_format VARCHAR(50)'
    ]

    for (const query of columnsToAdd) {
      try {
        await pool.query(query)
      } catch (err) {
        // Column might already exist, continue
      }
    }
  } catch (error) {
    console.error('Failed to initialize database:', error)
  }
}

// Initialize on first load
initDatabase()

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS'
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // GET - fetch all submissions
  if (event.httpMethod === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM submissions ORDER BY submitted_at DESC'
      )

      const submissions = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        creatorName: row.creator_name,
        contactEmail: row.contact_email,
        videoUrl: row.video_url,
        sourceType: row.source_type,
        embedUrl: row.embed_url,
        thumbnailUrl: row.thumbnail_url,
        duration: row.duration,
        socialMedia: {
          twitter: row.twitter,
          instagram: row.instagram,
          website: row.website
        },
        additionalNotes: row.additional_notes,
        status: row.status,
        submittedAt: row.submitted_at,
        reviewedAt: row.reviewed_at,
        adminNotes: row.admin_notes
      }))

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(submissions)
      }
    } catch (error) {
      console.error('Failed to get submissions:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch submissions' })
      }
    }
  }

  // POST - create new submission
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}')

      if (!body.title || !body.videoUrl || !body.contactEmail) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' })
        }
      }

      const submission = {
        id: body.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: body.title,
        description: body.description || '',
        category: body.category || '',
        creatorName: body.creatorName || '',
        contactEmail: body.contactEmail,
        videoUrl: body.videoUrl,
        sourceType: body.sourceType || 'other',
        embedUrl: body.embedUrl,
        thumbnailUrl: body.thumbnailUrl,
        duration: body.duration,
        twitter: body.twitter,
        instagram: body.instagram,
        website: body.website,
        additionalNotes: body.additionalNotes,
        status: 'pending',
        submittedAt: body.submittedAt || new Date().toISOString(),
        cloudinaryPublicId: body.cloudinaryPublicId || null,
        cloudinaryUrl: body.cloudinaryUrl || null,
        fileSize: body.fileSize || null,
        videoFormat: body.videoFormat || null
      }

      await pool.query(
        `INSERT INTO submissions (
          id, title, description, category, creator_name,
          contact_email, video_url, source_type, embed_url,
          thumbnail_url, duration, twitter, instagram, website,
          additional_notes, status, submitted_at, cloudinary_public_id,
          cloudinary_url, file_size, video_format
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)`,
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
          submission.twitter,
          submission.instagram,
          submission.website,
          submission.additionalNotes,
          submission.status,
          submission.submittedAt,
          submission.cloudinaryPublicId,
          submission.cloudinaryUrl,
          submission.fileSize,
          submission.videoFormat
        ]
      )

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: 'Submission received', id: submission.id })
      }
    } catch (error: any) {
      console.error('Failed to save submission - Details:', {
        error: error.message,
        code: error.code,
        detail: error.detail,
        stack: error.stack
      })
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to save submission',
          details: error.message || 'Database error'
        })
      }
    }
  }

  // PATCH - update submission
  if (event.httpMethod === 'PATCH') {
    try {
      const body = JSON.parse(event.body || '{}')
      const { id, status, adminNotes } = body

      if (!id || !status) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required fields' })
        }
      }

      await pool.query(
        `UPDATE submissions
         SET status = $1, admin_notes = $2, reviewed_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [status, adminNotes, id]
      )

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Submission updated'
        })
      }
    } catch (error) {
      console.error('Failed to update submission:', error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to update submission' })
      }
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  }
}