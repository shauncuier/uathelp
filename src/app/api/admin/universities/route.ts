// src/app/api/admin/universities/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireEditorOrAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import { createUniversitySchema } from "@/lib/validations/university";
import { createAdminLog } from "@/lib/server/admin-log";
import { generateSlug } from "@/lib/server/slug";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const division = searchParams.get("division");
    const search = searchParams.get("search");

    let query: any = adminDb.collection("universities").orderBy("nameEn", "asc");
    if (type) query = query.where("type", "==", type);
    if (division) query = query.where("division", "==", division);

    const snap = await query.get();
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

export async function POST(request: NextRequest) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  try {
    const body = await request.json();
    const parsed = createUniversitySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, "VALIDATION_ERROR", 400);
    }

    const data = parsed.data;
    const slug = data.slug || generateSlug(data.nameEn);
    const now = FieldValue.serverTimestamp();

    const ref = await adminDb.collection("universities").add({
      ...data,
      slug,
      createdAt: now,
      updatedAt: now,
    });

    await createAdminLog({
      action: "university_created",
      entityType: "university",
      entityId: ref.id,
      entityTitle: data.nameEn,
      performedBy: user.uid,
      performedByEmail: user.email,
      role: user.role,
    });

    return successResponse({ id: ref.id, slug }, "University created", 201);
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to create university", "SERVER_ERROR");
  }
}
