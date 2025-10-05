import { Handler } from '@netlify/functions'

// In-memory storage (resets on deploy)
let submissions: any[] = []

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
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(submissions)
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
        ...body,
        id: body.id || `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending',
        submittedAt: body.submittedAt || new Date().toISOString()
      }

      submissions.push(submission)

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: 'Submission received', id: submission.id })
      }
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to save submission' })
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

      const index = submissions.findIndex(s => s.id === id)
      if (index === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Submission not found' })
        }
      }

      submissions[index] = {
        ...submissions[index],
        status,
        adminNotes,
        reviewedAt: new Date().toISOString()
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Submission updated',
          submission: submissions[index]
        })
      }
    } catch (error) {
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