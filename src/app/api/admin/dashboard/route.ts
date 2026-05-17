// src/app/api/admin/dashboard/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireEditorOrAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";

export async function GET(request: NextRequest) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  try {
    const [
      noticesSnap,
      universitiesSnap,
      postsSnap,
      usersSnap,
      urgentSnap,
      latestNoticesSnap,
      latestPostsSnap,
      logsSnap,
      upcomingSnap,
    ] = await Promise.all([
      adminDb.collection("notices").get(),
      adminDb.collection("universities").get(),
      adminDb.collection("blogPosts").get(),
      adminDb.collection("users").get(),
      adminDb.collection("notices").where("isUrgent", "==", true).where("status", "==", "published").limit(5).get(),
      adminDb.collection("notices").orderBy("createdAt", "desc").limit(5).get(),
      adminDb.collection("blogPosts").orderBy("createdAt", "desc").limit(5).get(),
      adminDb.collection("adminLogs").orderBy("createdAt", "desc").limit(10).get(),
      adminDb.collection("notices")
        .where("status", "==", "published")
        .where("applicationEnd", ">=", new Date())
        .orderBy("applicationEnd", "asc")
        .limit(5)
        .get(),
    ]);

    const notices = noticesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const published = notices.filter((n: any) => n.status === "published").length;
    const draft = notices.filter((n: any) => n.status === "draft").length;
    const archived = notices.filter((n: any) => n.status === "archived").length;

    return successResponse({
      totalNotices: notices.length,
      publishedNotices: published,
      draftNotices: draft,
      archivedNotices: archived,
      urgentNotices: urgentSnap.size,
      totalUniversities: universitiesSnap.size,
      totalBlogPosts: postsSnap.size,
      totalUsers: usersSnap.size,
      latestNotices: latestNoticesSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      latestPosts: latestPostsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      recentAdminLogs: logsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      upcomingDeadlines: upcomingSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch dashboard data", "SERVER_ERROR");
  }
}
