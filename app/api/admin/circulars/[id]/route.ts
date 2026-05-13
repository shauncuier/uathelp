import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateDocument, deleteDocument, getDocument } from "@/lib/firebase/database";
import { checkAdminRole } from "@/lib/firebase/server";

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

type UpdateCircular = z.infer<typeof CircularSchema>;

// PATCH /api/admin/circulars/[id] - Update a circular
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // TODO: Implement Firebase Admin SDK for authentication
    
    const body = await request.json();
    const validatedData = CircularSchema.parse(body);

    // If universityId is being changed, verify it exists
    if (validatedData.universityId) {
      const university = await getDocument("universities", validatedData.universityId);

      if (!university) {
        return NextResponse.json(
          { error: "University not found" },
          { status: 404 }
        );
      }
    }

    await updateDocument("admissionCirculars", id, {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    });

    const updated = await getDocument("admissionCirculars", id);

    if (!updated) {
      return NextResponse.json(
        { error: "Circular not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
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
    // TODO: Implement Firebase Admin SDK for authentication
    
    await deleteDocument("admissionCirculars", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting circular:", error);
    return NextResponse.json(
      { error: "Failed to delete circular" },
      { status: 500 }
    );
  }
}
