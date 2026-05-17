// src/app/api/admin/settings/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import { updateSettingsSchema } from "@/lib/validations/settings";
import { createAdminLog } from "@/lib/server/admin-log";
import { FieldValue } from "firebase-admin/firestore";

const SETTINGS_DOC = "siteSettings/main";

export async function GET(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response!;

  try {
    const doc = await adminDb.doc(SETTINGS_DOC).get();
    const data = doc.exists ? doc.data() : {};
    return successResponse(data);
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch settings", "SERVER_ERROR");
  }
}

export async function PATCH(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response!;

  try {
    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, "VALIDATION_ERROR", 400);
    }

    await adminDb.doc(SETTINGS_DOC).set(
      { ...parsed.data, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );

    await createAdminLog({
      action: "settings_updated",
      entityType: "settings",
      performedBy: user.uid,
      performedByEmail: user.email,
      role: user.role,
    });

    return successResponse({}, "Settings updated");
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to update settings", "SERVER_ERROR");
  }
}
