import { NextResponse } from "next/server";
import { verifyAccessToken } from "./lib/utils/jwt";

export async function middleware(request) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Public paths
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Protect dashboard and developer routes (but not admin routes)
  // if (!token) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // const decoded = verifyAccessToken(token);
  // if (!decoded) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  // Removed '/admin/:path*' – admin routes are now protected by the layout
  matcher: ["/api/admin/:path*", "/dashboard/:path*", "/developer/:path*"],
};
