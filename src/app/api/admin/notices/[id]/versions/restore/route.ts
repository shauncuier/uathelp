// src/app/api/admin/notices/[id]/versions/restore/route.ts
/**
 * Restore a notice to a previous version
 * POST: Restore notice to specified version
 */

import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireEditorOrAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import { createAdminLog } from "@/lib/server/admin-log";
import { FieldValue } from "firebase-admin/firestore";
import {
  createNoticeVersion,
} from "@/lib/versioning/noticeVersioning";
import { Notice, NoticeVersion } from "@/types";
import { z } from "zod";

const restoreSchema = z.object({
  versionNumber: z.number().int().positive(),
  reason: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = restoreSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        parsed.error.issues[0].message,
        "VALIDATION_ERROR",
        400
      );
    }

    const { versionNumber, reason } = parsed.data;

    // Get current notice
    const noticeRef = adminDb.collection("notices").doc(id);
    const currentNoticeSnap = await noticeRef.get();
    if (!currentNoticeSnap.exists) {
      return errorResponse("Notice not found", "NOT_FOUND", 404);
    }

    const currentNotice = { id, ...currentNoticeSnap.data() } as Notice;

    // Get version to restore
    const versionSnap = await noticeRef
      .collection("versions")
      .where("versionNumber", "==", versionNumber)
      .limit(1)
      .get();

    if (versionSnap.empty) {
      return errorResponse("Version not found", "NOT_FOUND", 404);
    }

    const versionToRestore = versionSnap.docs[0].data() as NoticeVersion;

    // Create new version for current state before restoring
    const currentVersion: Omit<NoticeVersion, "id"> = createNoticeVersion(
      currentNotice,
      versionToRestore as any,
      "RESTORE",
      currentNotice.version + 1,
      user.uid,
      user.email,
      reason
    );

    // Update notice with restored content
    const restoreData = {
      title: versionToRestore.title,
      slug: versionToRestore.slug,
      summary: versionToRestore.summary,
      body: versionToRestore.body,
      category: versionToRestore.category,
      universityType: versionToRestore.universityType,
      unit: versionToRestore.unit,
      session: versionToRestore.session,
      applicationStart: versionToRestore.applicationStart,
      applicationEnd: versionToRestore.applicationEnd,
      examDate: versionToRestore.examDate,
      resultDate: versionToRestore.resultDate,
      pdfUrl: versionToRestore.pdfUrl,
      officialUrl: versionToRestore.officialUrl,
      imageUrl: versionToRestore.imageUrl,
      tags: versionToRestore.tags,
      searchKeywords: versionToRestore.searchKeywords,
      isFeatured: versionToRestore.isFeatured,
      isUrgent: versionToRestore.isUrgent,
      status: versionToRestore.status,
      seoTitle: versionToRestore.seoTitle,
      seoDescription: versionToRestore.seoDescription,
      version: currentNotice.version + 1,
      versionHistoryCount: (currentNotice.versionHistoryCount || 0) + 1,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await noticeRef.update(restoreData);

    // Save new restore version
    await noticeRef.collection("versions").add({
      ...currentVersion,
      createdAt: FieldValue.serverTimestamp(),
    });

    await createAdminLog({
      action: "notice_version_restored",
      entityType: "notice",
      entityId: id,
      entityTitle: currentNotice.title,
      performedBy: user.uid,
      performedByEmail: user.email,
      role: user.role,
      metadata: {
        restoredToVersion: versionNumber,
        reason: reason || null,
      },
    });

    return successResponse(
      { id, version: currentNotice.version + 1 },
      "Notice restored successfully"
    );
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to restore version", "SERVER_ERROR");
  }
}
