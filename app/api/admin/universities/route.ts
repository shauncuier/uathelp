import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyFirebaseToken, adminDb, checkAdminRoleFromAdmin } from "@/lib/firebase/admin";

// Validation schema for university creation/update
const UniversitySchema = z.object({
  name: z.string().min(2, "University name must be at least 2 characters"),
  shortCode: z.string().min(2).max(10),
  description: z.string().min(10, "Description must be at least 10 characters"),
  city: z.string().min(2),
  type: z.enum(["public", "private", "international"]),
  established: z.number().int(),
  website: z.string().url("Invalid website URL"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  logo: z.string().url().optional(),
  banner: z.string().url().optional(),
  ranking: z.number().int().positive().optional(),
  programs: z.array(z.string()).default([]),
  admissionFee: z.number().positive().optional(),
  admissionDeadline: z.string().optional(),
});

type University = z.infer<typeof UniversitySchema>;

// GET /api/admin/universities - Get all universities
export async function GET(request: NextRequest) {
  try {
    const decodedToken = await verifyFirebaseToken(request);

    if (!decodedToken || !(await checkAdminRoleFromAdmin(decodedToken.uid))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";

    // Build Firestore query
    let query: FirebaseFirestore.Query = adminDb.collection("universities");

    if (type) {
      query = query.where("type", "==", type);
    }

    query = query.orderBy("name");

    const snapshot = await query.get();
    let universities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side search filter (Firestore doesn't support ilike)
    if (search) {
      const searchLower = search.toLowerCase();
      universities = universities.filter(
        (u: any) =>
          u.name?.toLowerCase().includes(searchLower) ||
          u.shortCode?.toLowerCase().includes(searchLower) ||
          u.city?.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    const paginatedData = universities.slice(offset, offset + limitNum);

    return NextResponse.json({
      data: paginatedData,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: universities.length,
        pages: Math.ceil(universities.length / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching universities:", error);
    return NextResponse.json(
      { error: "Failed to fetch universities" },
      { status: 500 }
    );
  }
}

// POST /api/admin/universities - Create a new university
export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifyFirebaseToken(request);

    if (!decodedToken || !(await checkAdminRoleFromAdmin(decodedToken.uid))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = UniversitySchema.parse(body);

    const now = new Date().toISOString();
    const docRef = await adminDb.collection("universities").add({
      ...validatedData,
      createdAt: now,
      updatedAt: now,
    });

    const newDoc = await docRef.get();

    return NextResponse.json(
      { id: docRef.id, ...newDoc.data() },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating university:", error);
    return NextResponse.json(
      { error: "Failed to create university" },
      { status: 500 }
    );
  }
}
