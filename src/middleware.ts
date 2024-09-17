import { NextResponse, NextRequest } from 'next/server'
export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl

  // If user is logged in and trying to access auth routes, redirect to dashboard
  if (token && (
    url.pathname === '/signin' ||
    url.pathname === '/signup' ||
    url.pathname === '/verify' ||
    url.pathname === '/'
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not logged in and trying to access protected routes, redirect to sign-in
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Allow access to other pages
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/',
    '/verify/:path*',
    '/reset-password/:path*',
    '/dashboard/:path*',
    '/forget-password',
  ],
}
