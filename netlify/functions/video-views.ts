import { Handler } from "@netlify/functions"
import { Pool } from "pg"

// Create connection pool
const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  }

  // Handle OPTIONS request for CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" }
  }

  // GET: Fetch video view count
  if (event.httpMethod === "GET") {
    try {
      const videoPath = event.queryStringParameters?.videoPath

      if (!videoPath) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Video path is required" })
        }
      }

      const result = await pool.query(
        'SELECT view_count FROM video_views WHERE video_path = $1',
        [videoPath]
      )

      const viewCount = result.rows.length > 0 ? result.rows[0].view_count : 0

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ viewCount })
      }
    } catch (error) {
      console.error("Error fetching view count:", error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to fetch view count" })
      }
    }
  }

  // POST: Track a video view
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}")
      const { videoPath, videoTitle } = body

      if (!videoPath) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Video path is required" })
        }
      }

      // Extract session info from headers
      const sessionId = event.headers["x-session-id"] || null
      const userAgent = event.headers["user-agent"] || null

      // Log individual view
      await pool.query(
        `INSERT INTO view_logs (video_path, session_id, user_agent)
         VALUES ($1, $2, $3)`,
        [videoPath, sessionId, userAgent]
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

      // Get updated count
      const result = await pool.query(
        'SELECT view_count FROM video_views WHERE video_path = $1',
        [videoPath]
      )

      const viewCount = result.rows[0]?.view_count || 1

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, viewCount })
      }
    } catch (error) {
      console.error("Error tracking video view:", error)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Failed to track view" })
      }
    }
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" })
  }
}