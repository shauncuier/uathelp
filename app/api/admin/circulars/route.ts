import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryDocuments, addDocument, getDocument } from "@/lib/firebase/database";
import { checkAdminRole } from "@/lib/firebase/server";
import { where, orderBy, limit, startAfter } from "firebase/firestore";

// Validation schema for admission circulars
const CircularSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  universityId: z.string().uuid("Invalid university ID"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  programs: z.array(z.string()).min(1, "At least one program is required"),
  applicationDeadline: z.string().refine(
    (date) => new Date(date) > new Date(),
    "Application deadline must be in the future"
  ),
  admissionDate: z.string().optional(),
  resultDate: z.string().optional(),
  applicationFee: z.number().positive().optional(),
  requiredDocuments: z.array(z.string()).default([]),
  contactEmail: z.string().email("Invalid email").optional(),
  contactPhone: z.string().optional(),
  attachmentUrl: z.string().url().optional(),
  status: z.enum(["active", "closed", "draft"]).default("draft"),
  featured: z.boolean().default(false),
});

type Circular = z.infer<typeof CircularSchema>;

// GET /api/admin/circulars - Get all circulars
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement Firebase Admin SDK for authentication
    // For now, we'll skip auth check - implement after firebase-admin setup
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const universityId = searchParams.get("universityId") || "";

    // Build query constraints
    const constraints = [];
    
    if (status) {
      constraints.push(where("status", "==", status));
    }

    if (universityId) {
      constraints.push(where("universityId", "==", universityId));
    }

    // Get all circulars (Firestore doesn't support complex queries like ilike)
    let circulars = await queryDocuments("admissionCirculars", constraints);

    // Filter by search text on client side (simplified - for production use full-text search)
    if (search) {
      circulars = circulars.filter(
        (c) =>
          c.title?.toLowerCase().includes(search.toLowerCase()) ||
          c.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by application deadline
    circulars.sort(
      (a, b) =>
        new Date(b.applicationDeadline).getTime() -
        new Date(a.applicationDeadline).getTime()
    );

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    const paginatedData = circulars.slice(offset, offset + limitNum);

    return NextResponse.json({
      data: paginatedData,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: circulars.length,
        pages: Math.ceil(circulars.length / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching circulars:", error);
    return NextResponse.json(
      { error: "Failed to fetch circulars" },
      { status: 500 }
    );
  }
}

// POST /api/admin/circulars - Create a new circular
export async function POST(request: NextRequest) {
  try {
    // TODO: Implement Firebase Admin SDK for authentication
    // const userId = await getAuthenticatedUserId(request);
    // if (!userId || !(await checkAdminRole(userId))) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await request.json();
    const validatedData = CircularSchema.parse(body);

    // Verify university exists
    const university = await getDocument("universities", validatedData.universityId);
    
    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    // Create the circular document
    const circularId = await addDocument("admissionCirculars", {
      ...validatedData,
      postedById: "user.id", // TODO: Replace with actual user ID from auth
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { id: circularId, ...validatedData },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating circular:", error);
    return NextResponse.json(
      { error: "Failed to create circular" },
      { status: 500 }
    );
  }
}


