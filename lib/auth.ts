import { NextRequest } from 'next/server'
import { getSession, getUserById, type User } from '@/lib/db'

export async function getAuthenticatedUser(request: NextRequest): Promise<User | null> {
  try {
    const sessionId = request.cookies.get('session')?.value

    if (!sessionId) {
      return null
    }

    // Get session
    const session = await getSession(sessionId)
    if (!session) {
      return null
    }

    // Get user
    const user = await getUserById(session.user_id)
    return user

  } catch (error) {
    console.error('Auth check error:', error)
    return null
  }
}

export function requireAuth(handler: (request: NextRequest, user: User) => Promise<Response>) {
  return async (request: NextRequest) => {
    const user = await getAuthenticatedUser(request)

    if (!user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return handler(request, user)
  }
}