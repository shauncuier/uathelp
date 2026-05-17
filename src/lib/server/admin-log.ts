// src/lib/server/admin-log.ts
// Admin log creation helper
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { UserRole } from "@/types";

interface CreateLogParams {
  action: string;
  entityType: "notice" | "university" | "post" | "user" | "settings" | "upload";
  entityId?: string;
  entityTitle?: string;
  performedBy: string;
  performedByEmail: string;
  role: UserRole;
  metadata?: Record<string, unknown>;
}

export async function createAdminLog(params: CreateLogParams): Promise<void> {
  try {
    await adminDb.collection("adminLogs").add({
      ...params,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to create admin log:", err);
    // Non-critical — don't throw
  }
}
