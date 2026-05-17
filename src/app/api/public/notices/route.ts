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

    let query: any = adminDb
      .collection("notices")
      .where("status", "==", "published")
      .orderBy("publishedAt", "desc");

    if (category) query = query.where("category", "==", category);
    if (universityId) query = query.where("universityId", "==", universityId);
    if (universityType) query = query.where("universityType", "==", universityType);
    if (session) query = query.where("session", "==", session);
    if (urgent === "true") query = query.where("isUrgent", "==", true);
    if (featured === "true") query = query.where("isFeatured", "==", true);
    if (search) query = query.where("searchKeywords", "array-contains", search.toLowerCase());

    const snap = await query.limit(limit).get();
    const notices = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return successResponse({ notices, total: notices.length, hasMore: notices.length === limit });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch notices", "SERVER_ERROR");
  }
}
