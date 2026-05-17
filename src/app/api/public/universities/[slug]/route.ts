// src/app/api/public/universities/[slug]/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/server/api-response";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;

    const snap = await adminDb
      .collection("universities")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snap.empty) return errorResponse("University not found", "NOT_FOUND", 404);

    const doc = snap.docs[0];
    const university = { id: doc.id, ...doc.data() };

    // Get latest notices from this university
    const noticesSnap = await adminDb
      .collection("notices")
      .where("universityId", "==", doc.id)
      .where("status", "==", "published")
      .orderBy("publishedAt", "desc")
      .limit(6)
      .get();

    const notices = noticesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return successResponse({ university, notices });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch university", "SERVER_ERROR");
  }
}
