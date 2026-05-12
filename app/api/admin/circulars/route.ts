import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

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

// Helper to check admin role
async function checkAdminRole(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return profile?.role === "admin" || profile?.role === "moderator";
}

// GET /api/admin/circulars - Get all circulars
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !(await checkAdminRole(user.id))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const universityId = searchParams.get("universityId") || "";

    let query = supabase
      .from("admission_circulars")
      .select("*, universities(name, shortCode)", { count: "exact" });

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (universityId) {
      query = query.eq("universityId", universityId);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const { data, error, count } = await query
      .order("applicationDeadline", { ascending: false })
      .range(offset, offset + limitNum - 1);

    if (error) throw error;

    return NextResponse.json({
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        pages: Math.ceil((count || 0) / limitNum),
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
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !(await checkAdminRole(user.id))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CircularSchema.parse(body);

    // Verify university exists
    const { data: university, error: universityError } = await supabase
      .from("universities")
      .select("id")
      .eq("id", validatedData.universityId)
      .single();

    if (universityError || !university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("admission_circulars")
      .insert([
        {
          ...validatedData,
          postedById: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
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


