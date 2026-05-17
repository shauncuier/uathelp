// src/app/api/admin/uploads/route.ts
import { NextRequest } from "next/server";
import { adminStorage } from "@/lib/firebase/admin";
import { requireEditorOrAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import { createAdminLog } from "@/lib/server/admin-log";
import { UploadType } from "@/lib/validations/upload";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const ALLOWED_PDF_TYPES = ["application/pdf"];
const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

function getStoragePath(type: UploadType, entityId: string, filename: string): string {
  const paths: Record<UploadType, string> = {
    "notice-pdf": `uploads/notices/pdfs/${entityId}/${filename}`,
    "notice-image": `uploads/notices/images/${entityId}/${filename}`,
    "university-logo": `uploads/universities/logos/${entityId}/${filename}`,
    "blog-cover": `uploads/blog/covers/${entityId}/${filename}`,
  };
  return paths[type];
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as UploadType | null;
    const entityId = (formData.get("entityId") as string) || "general";

    if (!file) return errorResponse("No file provided", "MISSING_FILE", 400);
    if (!type) return errorResponse("Upload type is required", "MISSING_TYPE", 400);

    const isPdf = type === "notice-pdf";
    const allowedTypes = isPdf ? ALLOWED_PDF_TYPES : ALLOWED_IMAGE_TYPES;
    const maxSize = isPdf ? MAX_PDF_SIZE : MAX_IMAGE_SIZE;

    if (!allowedTypes.includes(file.type)) {
      return errorResponse(
        `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
        "INVALID_FILE_TYPE",
        400
      );
    }

    if (file.size > maxSize) {
      return errorResponse(
        `File too large. Max size: ${maxSize / 1024 / 1024}MB`,
        "FILE_TOO_LARGE",
        400
      );
    }

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const storagePath = getStoragePath(type, entityId, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(storagePath);

    await fileRef.save(buffer, {
      metadata: { contentType: file.type },
    });

    await fileRef.makePublic();
    const url = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

    await createAdminLog({
      action: "file_uploaded",
      entityType: "upload",
      entityId,
      entityTitle: filename,
      performedBy: user.uid,
      performedByEmail: user.email,
      role: user.role,
      metadata: { type, path: storagePath, size: file.size },
    });

    return successResponse({ url, path: storagePath }, "File uploaded successfully");
  } catch (err) {
    console.error(err);
    return errorResponse("Upload failed", "UPLOAD_ERROR");
  }
}
