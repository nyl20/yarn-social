import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token && req.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile'],
}