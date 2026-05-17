// src/app/api/public/notices/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/server/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const universityId = searchParams.get("universityId");
    const universityType = searchParams.get("universityType");
    const session = searchParams.get("session");
    const urgent = searchParams.get("urgent");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);

    // Fetch all published notices first to avoid composite index requirements
    const snap = await adminDb
      .collection("notices")
      .where("status", "==", "published")
      .get();

    let notices = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    // Apply filters in memory
    if (category) notices = notices.filter(n => n.category === category);
    if (universityId) notices = notices.filter(n => n.universityId === universityId);
    if (universityType) notices = notices.filter(n => n.universityType === universityType);
    if (session) notices = notices.filter(n => n.session === session);
    if (urgent === "true") notices = notices.filter(n => n.isUrgent === true);
    if (featured === "true") notices = notices.filter(n => n.isFeatured === true);
    if (search) notices = notices.filter(n => n.searchKeywords?.includes(search.toLowerCase()));

    // Sort by publishedAt descending
    notices.sort((a, b) => {
      const dateA = a.publishedAt?.toMillis ? a.publishedAt.toMillis() : new Date(a.publishedAt || 0).getTime();
      const dateB = b.publishedAt?.toMillis ? b.publishedAt.toMillis() : new Date(b.publishedAt || 0).getTime();
      return dateB - dateA;
    });

    // Apply limits
    const paginatedNotices = notices.slice(0, limit);

    return successResponse({ notices: paginatedNotices, total: notices.length, hasMore: notices.length > limit });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch notices", "SERVER_ERROR");
  }
}
