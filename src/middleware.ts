import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // This middleware can be used for additional route protection
  // For now, we're handling auth on the client side, but this can be enhanced

  const { pathname } = request.nextUrl;

  // Add any server-side route protection logic here if needed
  // For example, API route protection

  if (pathname.startsWith("/api/")) {
    // Add API authentication logic here if needed
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
