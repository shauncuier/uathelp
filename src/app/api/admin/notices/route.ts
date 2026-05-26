// src/app/api/admin/notices/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireEditorOrAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import { createNoticeSchema } from "@/lib/validations/notice";
import { createAdminLog } from "@/lib/server/admin-log";
import { generateUniqueSlug } from "@/lib/server/slug";
import { generateSearchKeywords } from "@/lib/server/search-keywords";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const universityId = searchParams.get("universityId");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = adminDb.collection("notices").orderBy("createdAt", "desc");

    if (status) query = query.where("status", "==", status) as any;
    if (category) query = query.where("category", "==", category) as any;
    if (universityId) query = query.where("universityId", "==", universityId) as any;
    if (search) query = query.where("searchKeywords", "array-contains", search.toLowerCase()) as any;

    const snap = await (query as any).limit(limit).get();
    const notices = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return successResponse({ notices, total: notices.length });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch notices", "SERVER_ERROR");
  }
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireEditorOrAdmin(request);
  if (!user) return response!;

  try {
    const body = await request.json();
    const parsed = createNoticeSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, "VALIDATION_ERROR", 400);
    }

    const data = parsed.data;
    const baseSlugText = data.slug || data.title;
    const slug = await generateUniqueSlug(adminDb, "notices", baseSlugText);
    const searchKeywords = generateSearchKeywords([
      data.title,
      data.universityName,
      data.category,
      data.session,
      ...(data.tags || []),
    ]);

    const now = FieldValue.serverTimestamp();
    const noticeData: any = {
      ...data,
      slug,
      searchKeywords,
      viewCount: 0,
      authorId: user.uid,
      version: 1,
      versionHistoryCount: 1,
      createdAt: now,
      updatedAt: now,
    };

    if (data.status === "published") {
      noticeData.publishedAt = now;
    }

    const ref = await adminDb.collection("notices").add(noticeData);

    // Create initial version record
    await ref.collection("versions").add({
      noticeId: ref.id,
      versionNumber: 1,
      title: data.title,
      slug,
      summary: data.summary,
      body: data.body,
      universityId: data.universityId,
      universityName: data.universityName,
      category: data.category,
      universityType: data.universityType,
      unit: data.unit,
      session: data.session,
      applicationStart: data.applicationStart,
      applicationEnd: data.applicationEnd,
      examDate: data.examDate,
      resultDate: data.resultDate,
      pdfUrl: data.pdfUrl,
      officialUrl: data.officialUrl,
      imageUrl: data.imageUrl,
      tags: data.tags || [],
      searchKeywords,
      isFeatured: data.isFeatured || false,
      isUrgent: data.isUrgent || false,
      viewCount: 0,
      status: data.status,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      changeType: "CREATE",
      changedFields: [],
      changes: {},
      changelog: "Notice created",
      createdAt: now,
      createdBy: user.uid,
      createdByName: user.email,
    });

    await createAdminLog({
      action: "notice_created",
      entityType: "notice",
      entityId: ref.id,
      entityTitle: data.title,
      performedBy: user.uid,
      performedByEmail: user.email,
      role: user.role,
    });

    return successResponse({ id: ref.id, slug }, "Notice created successfully", 201);
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to create notice", "SERVER_ERROR");
  }
}
