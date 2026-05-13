import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware proxy for route protection.
 * 
 * With Firebase Auth (client-side), the middleware can't directly verify
 * auth tokens like Supabase cookie-based auth did. Instead, protected pages
 * handle their own auth checks using the useAuth() hook on the client.
 * 
 * This middleware now only handles:
 * 1. Setting security headers
 * 2. Basic route matching (actual auth is done client-side)
 */
export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  
  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
