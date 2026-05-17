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

    const snap = await adminDb
      .collection("blogPosts")
      .where("status", "==", "published")
      .get();

    let posts = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    if (category) posts = posts.filter(p => p.category === category);
    if (search) posts = posts.filter(p => p.searchKeywords?.includes(search.toLowerCase()));

    posts.sort((a, b) => {
      const dateA = a.publishedAt?.toMillis ? a.publishedAt.toMillis() : new Date(a.publishedAt || 0).getTime();
      const dateB = b.publishedAt?.toMillis ? b.publishedAt.toMillis() : new Date(b.publishedAt || 0).getTime();
      return dateB - dateA;
    });

    const paginatedPosts = posts.slice(0, limit);

    return successResponse({ posts: paginatedPosts, total: posts.length, hasMore: posts.length > limit });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch posts", "SERVER_ERROR");
  }
}
