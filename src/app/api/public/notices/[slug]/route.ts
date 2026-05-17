// src/app/api/public/notices/[slug]/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const snap = await adminDb
      .collection("notices")
      .where("slug", "==", slug)
      .where("status", "==", "published")
      .limit(1)
      .get();

    if (snap.empty) return errorResponse("Notice not found", "NOT_FOUND", 404);

    const doc = snap.docs[0];
    const notice = { id: doc.id, ...doc.data() };

    // Increment viewCount atomically (fire and forget)
    doc.ref.update({ viewCount: FieldValue.increment(1) }).catch(() => {});

    // Get related notices from same university without composite index
    const relatedSnap = await adminDb
      .collection("notices")
      .where("universityId", "==", (notice as any).universityId)
      .get();

    const related = relatedSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((n: any) => n.id !== doc.id && n.status === "published")
      .sort((a: any, b: any) => {
        const dateA = a.publishedAt?.toMillis ? a.publishedAt.toMillis() : new Date(a.publishedAt || 0).getTime();
        const dateB = b.publishedAt?.toMillis ? b.publishedAt.toMillis() : new Date(b.publishedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);

    return successResponse({ notice, related });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch notice", "SERVER_ERROR");
  }
}
