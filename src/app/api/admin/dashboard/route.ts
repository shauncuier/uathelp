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
      logsSnap,
    ] = await Promise.all([
      adminDb.collection("notices").get(),
      adminDb.collection("universities").get(),
      adminDb.collection("blogPosts").get(),
      adminDb.collection("users").get(),
      adminDb.collection("adminLogs").orderBy("createdAt", "desc").limit(10).get(),
    ]);

    const notices = noticesSnap.docs.map((d) => ({ id: d.id, ...d.data() as any }));
    const posts = postsSnap.docs.map((d) => ({ id: d.id, ...d.data() as any }));

    const publishedNotices = notices.filter((n) => n.status === "published");
    const draftNotices = notices.filter((n) => n.status === "draft");
    const archivedNotices = notices.filter((n) => n.status === "archived");
    const urgentNotices = publishedNotices.filter((n) => n.isUrgent);

    const latestNotices = [...notices].sort((a, b) => {
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
      return bTime - aTime;
    }).slice(0, 5);

    const latestPosts = [...posts].sort((a, b) => {
      const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
      const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
      return bTime - aTime;
    }).slice(0, 5);

    const now = new Date().getTime();
    const upcomingDeadlines = publishedNotices
      .filter((n) => {
        if (!n.applicationEnd) return false;
        const end = n.applicationEnd.toDate ? n.applicationEnd.toDate().getTime() : new Date(n.applicationEnd).getTime();
        return end >= now;
      })
      .sort((a, b) => {
        const aEnd = a.applicationEnd.toDate ? a.applicationEnd.toDate().getTime() : new Date(a.applicationEnd).getTime();
        const bEnd = b.applicationEnd.toDate ? b.applicationEnd.toDate().getTime() : new Date(b.applicationEnd).getTime();
        return aEnd - bEnd;
      })
      .slice(0, 5);

    return successResponse({
      totalNotices: notices.length,
      publishedNotices: publishedNotices.length,
      draftNotices: draftNotices.length,
      archivedNotices: archivedNotices.length,
      urgentNotices: urgentNotices.length,
      totalUniversities: universitiesSnap.size,
      totalBlogPosts: posts.length,
      totalUsers: usersSnap.size,
      latestNotices,
      latestPosts,
      recentAdminLogs: logsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      upcomingDeadlines,
    });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch dashboard data", "SERVER_ERROR");
  }
}
