import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value

    if (sessionId) {
      // Delete session from database
      await deleteSession(sessionId)
    }

    // Create response and clear cookie
    const response = NextResponse.json({ success: true })

    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}