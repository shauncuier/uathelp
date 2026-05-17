// src/app/api/public/universities/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/server/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const division = searchParams.get("division");
    const district = searchParams.get("district");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    let query: any = adminDb.collection("universities").orderBy("nameEn", "asc");
    if (type) query = query.where("type", "==", type);
    if (division) query = query.where("division", "==", division);
    if (district) query = query.where("district", "==", district);
    if (featured === "true") query = query.where("isFeatured", "==", true);

    const snap = await query.limit(100).get();
    let universities = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    if (search) {
      const q = search.toLowerCase();
      universities = universities.filter(
        (u: any) =>
          u.nameEn?.toLowerCase().includes(q) ||
          u.nameBn?.includes(search) ||
          u.shortName?.toLowerCase().includes(q)
      );
    }

    return successResponse({ universities, total: universities.length });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch universities", "SERVER_ERROR");
  }
}
