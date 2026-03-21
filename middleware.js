import { NextResponse } from 'next/server';
import { verifyAccessToken } from './lib/utils/jwt';

export async function middleware(request) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Public paths
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For admin/owner routes, we need to check role. We'll do that in the layout/page itself.
  // But we can add a basic check here if we want.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/dashboard/:path*', '/developer/:path*'],
};