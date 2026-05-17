// src/app/api/admin/posts/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireEditorOrAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import { createPostSchema } from "@/lib/validations/post";
import { createAdminLog } from "@/lib/server/admin-log";
import { generateSlug, generateUniqueSlug } from "@/lib/server/slug";
import { generateSearchKeywords } from "@/lib/server/search-keywords";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query: any = adminDb.collection("blogPosts").orderBy("createdAt", "desc");
    if (status) query = query.where("status", "==", status);
    if (category) query = query.where("category", "==", category);
    if (search) query = query.where("searchKeywords", "array-contains", search.toLowerCase());

    const snap = await query.limit(limit).get();
    const posts = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return successResponse({ posts, total: posts.length });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch posts", "SERVER_ERROR");
  }
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  try {
    const body = await request.json();
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, "VALIDATION_ERROR", 400);
    }

    const data = parsed.data;
    const baseSlugText = data.slug || data.title;
    const slug = await generateUniqueSlug(adminDb, "blogPosts", baseSlugText);
    const searchKeywords = generateSearchKeywords([
      data.title,
      data.category,
      ...(data.tags || []),
    ]);

    const now = FieldValue.serverTimestamp();
    const postData: any = {
      ...data,
      slug,
      searchKeywords,
      viewCount: 0,
      authorId: user.uid,
      createdAt: now,
      updatedAt: now,
    };

    if (data.status === "published") postData.publishedAt = now;

    const ref = await adminDb.collection("blogPosts").add(postData);

    await createAdminLog({
      action: "post_created",
      entityType: "post",
      entityId: ref.id,
      entityTitle: data.title,
      performedBy: user.uid,
      performedByEmail: user.email,
      role: user.role,
    });

    return successResponse({ id: ref.id, slug }, "Post created", 201);
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to create post", "SERVER_ERROR");
  }
}
