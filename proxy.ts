import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient, updateSession } from "@/lib/supabase/middleware";

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach(({ name, value }) => {
    target.cookies.set(name, value);
  });
}

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;
  
  // Protected routes that require authentication
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isChatRoute = pathname === "/chat" || pathname.startsWith("/chat/");
  const isBookmarksRoute = pathname === "/bookmarks" || pathname.startsWith("/bookmarks/");
  const isSavedRoute = pathname === "/saved" || pathname.startsWith("/saved/");
  const isNotificationsRoute = pathname === "/notifications" || pathname.startsWith("/notifications/");
  const isApplicationsRoute = pathname === "/applications" || pathname.startsWith("/applications/");
  const isSettingsRoute = pathname === "/settings" || pathname.startsWith("/settings/");

  const isProtectedRoute = 
    isDashboardRoute || 
    isAdminRoute || 
    isChatRoute || 
    isBookmarksRoute || 
    isSavedRoute || 
    isNotificationsRoute || 
    isApplicationsRoute || 
    isSettingsRoute;

  // Allow public routes without auth
  if (!isProtectedRoute) {
    return response;
  }

  const supabase = createMiddlewareClient(request, response);
  const { data: { user } } = await supabase.auth.getUser();

  // Require authentication for protected routes
  if (!user) {
    const redirect = NextResponse.redirect(new URL(`/login?redirectTo=${encodeURIComponent(pathname)}`, request.url));
    copyCookies(response, redirect);
    return redirect;
  }

  // Get user profile for role checks
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Create profile if doesn't exist
  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      full_name: user.user_metadata?.full_name ?? user.email ?? "Student",
      avatar_url: user.user_metadata?.avatar_url ?? null,
      email: user.email ?? null,
      role: "student",
      is_verified: false,
      is_blocked: false,
    });
  }

  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!preferences) {
    await supabase.from("user_preferences").insert({
      user_id: user.id,
      email_notifications: true,
      deadline_reminders: true,
      product_updates: false,
      weekly_digest: false,
      theme_preference: "system",
    });
  }

  // Check if user is blocked
  if (profile?.is_blocked) {
    const redirect = NextResponse.redirect(new URL("/blocked", request.url));
    copyCookies(response, redirect);
    return redirect;
  }

  // Check admin role for admin routes
  if (isAdminRoute) {
    const isAdmin = profile?.role === "admin" || profile?.role === "super_admin";
    if (!isAdmin) {
      const redirect = NextResponse.redirect(new URL("/dashboard", request.url));
      copyCookies(response, redirect);
      return redirect;
    }
  }

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
