// src/app/api/admin/posts/[id]/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireEditorOrAdmin, requireAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import { updatePostSchema } from "@/lib/validations/post";
import { createAdminLog } from "@/lib/server/admin-log";
import { generateSlug, generateUniqueSlug } from "@/lib/server/slug";
import { generateSearchKeywords } from "@/lib/server/search-keywords";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  const { id } = await params;
  const doc = await adminDb.collection("blogPosts").doc(id).get();
  if (!doc.exists) return errorResponse("Post not found", "NOT_FOUND", 404);

  return successResponse({ id: doc.id, ...doc.data() });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  const { id } = await params;
  const ref = adminDb.collection("blogPosts").doc(id);
  const existing = await ref.get();
  if (!existing.exists) return errorResponse("Post not found", "NOT_FOUND", 404);

  const body = await request.json();
  const parsed = updatePostSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0].message, "VALIDATION_ERROR", 400);
  }

  const data = parsed.data;
  const existingData = existing.data() as any;
  const updateData: any = { ...data, updatedAt: FieldValue.serverTimestamp() };

  if (data.slug) {
    updateData.slug = await generateUniqueSlug(adminDb, "blogPosts", data.slug, id);
  } else if (data.title && data.title !== existingData.title) {
    updateData.slug = await generateUniqueSlug(adminDb, "blogPosts", data.title, id);
  }

  if (data.title || data.category || data.tags) {
    updateData.searchKeywords = generateSearchKeywords([
      data.title || existingData.title,
      data.category || existingData.category,
      ...(data.tags || existingData.tags || []),
    ]);
  }

  if (data.status === "published" && existingData.status !== "published") {
    updateData.publishedAt = FieldValue.serverTimestamp();
  }

  await ref.update(updateData);

  await createAdminLog({
    action: "post_updated",
    entityType: "post",
    entityId: id,
    entityTitle: data.title || existingData.title,
    performedBy: user.uid,
    performedByEmail: user.email,
    role: user.role,
  });

  return successResponse({ id }, "Post updated");
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response!;

  const { id } = await params;
  const ref = adminDb.collection("blogPosts").doc(id);
  const existing = await ref.get();
  if (!existing.exists) return errorResponse("Post not found", "NOT_FOUND", 404);

  await ref.update({ status: "archived", updatedAt: FieldValue.serverTimestamp() });

  await createAdminLog({
    action: "post_deleted",
    entityType: "post",
    entityId: id,
    entityTitle: (existing.data() as any).title,
    performedBy: user.uid,
    performedByEmail: user.email,
    role: user.role,
  });

  return successResponse({ id }, "Post archived");
}
