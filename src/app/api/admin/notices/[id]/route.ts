// src/app/api/admin/notices/[id]/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireEditorOrAdmin, requireAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import { updateNoticeSchema } from "@/lib/validations/notice";
import { createAdminLog } from "@/lib/server/admin-log";
import { generateUniqueSlug } from "@/lib/server/slug";
import { generateSearchKeywords } from "@/lib/server/search-keywords";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  const { id } = await params;
  const doc = await adminDb.collection("notices").doc(id).get();
  if (!doc.exists) return errorResponse("Notice not found", "NOT_FOUND", 404);

  return successResponse({ id: doc.id, ...doc.data() });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  const { id } = await params;
  const ref = adminDb.collection("notices").doc(id);
  const existing = await ref.get();
  if (!existing.exists) return errorResponse("Notice not found", "NOT_FOUND", 404);

  const body = await request.json();
  const parsed = updateNoticeSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0].message, "VALIDATION_ERROR", 400);
  }

  const data = parsed.data;
  const existingData = existing.data() as any;
  const updateData: any = { ...data, updatedAt: FieldValue.serverTimestamp() };

  // Regenerate slug if title changed
  if (data.slug) {
    updateData.slug = await generateUniqueSlug(adminDb, "notices", data.slug, id);
  } else if (data.title && data.title !== existingData.title) {
    updateData.slug = await generateUniqueSlug(adminDb, "notices", data.title, id);
  }

  // Regenerate searchKeywords if relevant fields changed
  if (data.title || data.universityName || data.category || data.session || data.tags) {
    updateData.searchKeywords = generateSearchKeywords([
      data.title || existingData.title,
      data.universityName || existingData.universityName,
      data.category || existingData.category,
      data.session || existingData.session,
      ...(data.tags || existingData.tags || []),
    ]);
  }

  // Set publishedAt when going from draft → published
  if (data.status === "published" && existingData.status !== "published") {
    updateData.publishedAt = FieldValue.serverTimestamp();
  }

  await ref.update(updateData);

  await createAdminLog({
    action: "notice_updated",
    entityType: "notice",
    entityId: id,
    entityTitle: data.title || existingData.title,
    performedBy: user.uid,
    performedByEmail: user.email,
    role: user.role,
  });

  return successResponse({ id }, "Notice updated successfully");
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Only admins can delete/archive
  const { user, response } = await requireAdmin(request);
  if (!user) return response!;

  const { id } = await params;
  const ref = adminDb.collection("notices").doc(id);
  const existing = await ref.get();
  if (!existing.exists) return errorResponse("Notice not found", "NOT_FOUND", 404);

  // Soft delete — archive
  await ref.update({
    status: "archived",
    updatedAt: FieldValue.serverTimestamp(),
  });

  await createAdminLog({
    action: "notice_archived",
    entityType: "notice",
    entityId: id,
    entityTitle: (existing.data() as any).title,
    performedBy: user.uid,
    performedByEmail: user.email,
    role: user.role,
  });

  return successResponse({ id }, "Notice archived successfully");
}
