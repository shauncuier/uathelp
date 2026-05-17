// src/app/api/admin/universities/[id]/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireEditorOrAdmin, requireAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import { updateUniversitySchema } from "@/lib/validations/university";
import { createAdminLog } from "@/lib/server/admin-log";
import { generateSlug } from "@/lib/server/slug";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  const { id } = await params;
  const doc = await adminDb.collection("universities").doc(id).get();
  if (!doc.exists) return errorResponse("University not found", "NOT_FOUND", 404);

  return successResponse({ id: doc.id, ...doc.data() });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  const { id } = await params;
  const ref = adminDb.collection("universities").doc(id);
  const existing = await ref.get();
  if (!existing.exists) return errorResponse("University not found", "NOT_FOUND", 404);

  const body = await request.json();
  const parsed = updateUniversitySchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0].message, "VALIDATION_ERROR", 400);
  }

  const data = parsed.data;
  const existingData = existing.data() as any;
  const updateData: any = { ...data, updatedAt: FieldValue.serverTimestamp() };

  if (data.nameEn && data.nameEn !== existingData.nameEn && !data.slug) {
    updateData.slug = generateSlug(data.nameEn);
  }

  await ref.update(updateData);

  await createAdminLog({
    action: "university_updated",
    entityType: "university",
    entityId: id,
    entityTitle: data.nameEn || existingData.nameEn,
    performedBy: user.uid,
    performedByEmail: user.email,
    role: user.role,
  });

  return successResponse({ id }, "University updated");
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response!;

  const { id } = await params;
  const ref = adminDb.collection("universities").doc(id);
  const existing = await ref.get();
  if (!existing.exists) return errorResponse("University not found", "NOT_FOUND", 404);

  await ref.delete();

  await createAdminLog({
    action: "university_deleted",
    entityType: "university",
    entityId: id,
    entityTitle: (existing.data() as any).nameEn,
    performedBy: user.uid,
    performedByEmail: user.email,
    role: user.role,
  });

  return successResponse({ id }, "University deleted");
}
