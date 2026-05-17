// src/app/api/public/posts/[slug]/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const snap = await adminDb
      .collection("blogPosts")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();

    if (snap.empty) return errorResponse("Post not found", "NOT_FOUND", 404);

    const doc = snap.docs[0];
    const post = { id: doc.id, ...doc.data() };

    // Increment viewCount
    doc.ref.update({ viewCount: FieldValue.increment(1) }).catch(() => {});

    // Related posts same category without composite index
    const relatedSnap = await adminDb
      .collection("blogPosts")
      .where("category", "==", (post as any).category)
      .get();

    const related = relatedSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p: any) => p.id !== doc.id && p.status === "published")
      .sort((a: any, b: any) => {
        const dateA = a.publishedAt?.toMillis ? a.publishedAt.toMillis() : new Date(a.publishedAt || 0).getTime();
        const dateB = b.publishedAt?.toMillis ? b.publishedAt.toMillis() : new Date(b.publishedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);

    return successResponse({ post, related });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch post", "SERVER_ERROR");
  }
}
