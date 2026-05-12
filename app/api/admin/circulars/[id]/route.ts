import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Validation schema for admission circulars
const CircularSchema = z.object({
  title: z.string().min(5).optional(),
  universityId: z.string().uuid().optional(),
  description: z.string().min(20).optional(),
  content: z.string().min(50).optional(),
  programs: z.array(z.string()).optional(),
  applicationDeadline: z.string().optional(),
  admissionDate: z.string().optional(),
  resultDate: z.string().optional(),
  applicationFee: z.number().positive().optional(),
  requiredDocuments: z.array(z.string()).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  attachmentUrl: z.string().url().optional(),
  status: z.enum(["active", "closed", "draft"]).optional(),
  featured: z.boolean().optional(),
});

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

// PATCH /api/admin/circulars/[id] - Update a circular
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // If universityId is being changed, verify it exists
    if (validatedData.universityId) {
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
    }

    const { data, error } = await supabase
      .from("admission_circulars")
      .update({
        ...validatedData,
        updatedAt: new Date(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: "Circular not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating circular:", error);
    return NextResponse.json(
      { error: "Failed to update circular" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/circulars/[id] - Delete a circular
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const { error } = await supabase
      .from("admission_circulars")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting circular:", error);
    return NextResponse.json(
      { error: "Failed to delete circular" },
      { status: 500 }
    );
  }
}
