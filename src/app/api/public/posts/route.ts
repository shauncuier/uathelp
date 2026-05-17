// src/app/api/public/posts/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/server/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);

    let query: any = adminDb
      .collection("blogPosts")
      .where("status", "==", "published")
      .orderBy("publishedAt", "desc");

    if (category) query = query.where("category", "==", category);
    if (search) query = query.where("searchKeywords", "array-contains", search.toLowerCase());

    const snap = await query.limit(limit).get();
    const posts = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return successResponse({ posts, total: posts.length, hasMore: posts.length === limit });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch posts", "SERVER_ERROR");
  }
}
