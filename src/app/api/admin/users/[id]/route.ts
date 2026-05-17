// src/app/api/admin/users/[id]/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import { updateUserSchema } from "@/lib/validations/user";
import { createAdminLog } from "@/lib/server/admin-log";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response!;

  const { id } = await params;
  const doc = await adminDb.collection("users").doc(id).get();
  if (!doc.exists) return errorResponse("User not found", "NOT_FOUND", 404);

  return successResponse({ id: doc.id, ...doc.data() });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response!;

  const { id } = await params;
  const ref = adminDb.collection("users").doc(id);
  const existing = await ref.get();
  if (!existing.exists) return errorResponse("User not found", "NOT_FOUND", 404);

  const body = await request.json();
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0].message, "VALIDATION_ERROR", 400);
  }

  // Prevent self-demotion accidentally
  if (id === user.uid && parsed.data.role && parsed.data.role !== "admin") {
    return errorResponse("You cannot remove your own admin role", "FORBIDDEN", 403);
  }

  await ref.update({ ...parsed.data, updatedAt: FieldValue.serverTimestamp() });

  const action = parsed.data.role
    ? "user_role_updated"
    : parsed.data.status === "disabled"
    ? "user_disabled"
    : "user_updated";

  await createAdminLog({
    action,
    entityType: "user",
    entityId: id,
    entityTitle: (existing.data() as any).email,
    performedBy: user.uid,
    performedByEmail: user.email,
    role: user.role,
    metadata: { changes: parsed.data },
  });

  return successResponse({ id }, "User updated");
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response!;

  const { id } = await params;
  if (id === user.uid) return errorResponse("Cannot disable yourself", "FORBIDDEN", 403);

  const ref = adminDb.collection("users").doc(id);
  const existing = await ref.get();
  if (!existing.exists) return errorResponse("User not found", "NOT_FOUND", 404);

  // Prefer disable over delete
  await ref.update({ status: "disabled", updatedAt: FieldValue.serverTimestamp() });

  await createAdminLog({
    action: "user_disabled",
    entityType: "user",
    entityId: id,
    entityTitle: (existing.data() as any).email,
    performedBy: user.uid,
    performedByEmail: user.email,
    role: user.role,
  });

  return successResponse({ id }, "User disabled");
}
