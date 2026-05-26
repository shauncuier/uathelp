// src/app/api/admin/notices/[id]/versions/route.ts
/**
 * Notice versions API endpoints
 * GET: Fetch version history for a notice
 */

import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireEditorOrAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  try {
    const { id } = await params;
    
    // Verify notice exists
    const notice = await adminDb.collection("notices").doc(id).get();
    if (!notice.exists) {
      return errorResponse("Notice not found", "NOT_FOUND", 404);
    }

    // Fetch version history, ordered by version number descending
    const versionsSnap = await adminDb
      .collection("notices")
      .doc(id)
      .collection("versions")
      .orderBy("versionNumber", "desc")
      .get();

    const versions = versionsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return successResponse({
      noticeId: id,
      currentVersion: notice.data()?.version || 1,
      totalVersions: versions.length,
      versions,
    });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch version history", "SERVER_ERROR");
  }
}
