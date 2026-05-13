import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseToken, getProfileFromAdmin } from "@/lib/firebase/admin";

export async function adminMiddleware(request: NextRequest) {
  // Verify Firebase token from Authorization header
  const decodedToken = await verifyFirebaseToken(request);

  if (!decodedToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Get user role from Firestore profiles collection
  const profile = await getProfileFromAdmin(decodedToken.uid);

  if (!profile) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check if user has admin or moderator role
  if (!["admin", "moderator", "super_admin"].includes(profile.role as string)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
