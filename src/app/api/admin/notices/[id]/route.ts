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
import {
  createNoticeVersion,
  getChangedFields,
  getChanges,
  generateChangelog,
} from "@/lib/versioning/noticeVersioning";
import { Notice } from "@/types";

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
    return errorResponse(parsed.error.issues[0].message, "VALIDATION_ERROR", 400);
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

  // Version tracking
  const changedFields = getChangedFields(data, existingData);
  const changes = getChanges(data, existingData);
  const changelog = generateChangelog(data, existingData);

  // Only create a version if there are actual changes
  if (changedFields.length > 0) {
    const currentVersion = (existingData.version || 1);
    const newVersionNumber = currentVersion + 1;
    updateData.version = newVersionNumber;
    updateData.versionHistoryCount = (existingData.versionHistoryCount || 1) + 1;

    // Create version record
    const versionData = {
      noticeId: id,
      versionNumber: newVersionNumber,
      title: data.title || existingData.title,
      slug: updateData.slug || existingData.slug,
      summary: data.summary || existingData.summary,
      body: data.body || existingData.body,
      universityId: data.universityId || existingData.universityId,
      universityName: data.universityName || existingData.universityName,
      category: data.category || existingData.category,
      universityType: data.universityType || existingData.universityType,
      unit: data.unit || existingData.unit,
      session: data.session || existingData.session,
      applicationStart: data.applicationStart || existingData.applicationStart,
      applicationEnd: data.applicationEnd || existingData.applicationEnd,
      examDate: data.examDate || existingData.examDate,
      resultDate: data.resultDate || existingData.resultDate,
      pdfUrl: data.pdfUrl || existingData.pdfUrl,
      officialUrl: data.officialUrl || existingData.officialUrl,
      imageUrl: data.imageUrl || existingData.imageUrl,
      tags: data.tags || existingData.tags || [],
      searchKeywords: updateData.searchKeywords || existingData.searchKeywords,
      isFeatured: data.isFeatured !== undefined ? data.isFeatured : existingData.isFeatured,
      isUrgent: data.isUrgent !== undefined ? data.isUrgent : existingData.isUrgent,
      viewCount: existingData.viewCount || 0,
      status: data.status || existingData.status,
      seoTitle: data.seoTitle || existingData.seoTitle,
      seoDescription: data.seoDescription || existingData.seoDescription,
      changeType: "UPDATE",
      changedFields,
      changes,
      changelog,
      createdAt: FieldValue.serverTimestamp(),
      createdBy: user.uid,
      createdByName: user.email,
    };

    // Save to versions subcollection
    await ref.collection("versions").add(versionData);
  } else {
    // Initialize version fields if they don't exist
    if (!existingData.version) {
      updateData.version = 1;
    }
    if (!existingData.versionHistoryCount) {
      updateData.versionHistoryCount = 1;
    }
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
