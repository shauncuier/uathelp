// src/app/api/public/search/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/server/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase().trim();

    if (!q || q.length < 2) {
      return successResponse({ notices: [], universities: [], posts: [] });
    }

    const [noticesSnap, universitiesSnap, postsSnap] = await Promise.all([
      adminDb
        .collection("notices")
        .where("status", "==", "published")
        .where("searchKeywords", "array-contains", q)
        .limit(5)
        .get(),
      adminDb.collection("universities").limit(100).get(),
      adminDb
        .collection("blogPosts")
        .where("status", "==", "published")
        .where("searchKeywords", "array-contains", q)
        .limit(5)
        .get(),
    ]);

    const notices = noticesSnap.docs.map((d) => ({
      id: d.id,
      title: (d.data() as any).title,
      slug: (d.data() as any).slug,
      universityName: (d.data() as any).universityName,
      category: (d.data() as any).category,
    }));

    // Filter universities in memory for partial text match
    const universities = universitiesSnap.docs
      .filter((d) => {
        const data = d.data() as any;
        return (
          data.nameEn?.toLowerCase().includes(q) ||
          data.shortName?.toLowerCase().includes(q) ||
          data.nameBn?.includes(q)
        );
      })
      .slice(0, 5)
      .map((d) => ({
        id: d.id,
        nameEn: (d.data() as any).nameEn,
        slug: (d.data() as any).slug,
        type: (d.data() as any).type,
      }));

    const posts = postsSnap.docs.map((d) => ({
      id: d.id,
      title: (d.data() as any).title,
      slug: (d.data() as any).slug,
      category: (d.data() as any).category,
    }));

    return successResponse({ notices, universities, posts });
  } catch (err) {
    console.error(err);
    return errorResponse("Search failed", "SERVER_ERROR");
  }
}
