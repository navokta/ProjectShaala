import { NextResponse } from 'next/server';
import { verifyAccessToken } from './lib/utils/jwt-edge';  // ← import from edge version

export async function middleware(request) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Public paths – no authentication required
  const isPublicPath =
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/auth'); // Exclude all auth API routes

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Protect only specific routes
  const isProtectedPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/developer') ||
    pathname.startsWith('/api/admin');

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const decoded = await verifyAccessToken(token);
  if (!decoded) {
    return NextResponse.redirect(new URL('/login?expired=1', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files – we filter inside
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};