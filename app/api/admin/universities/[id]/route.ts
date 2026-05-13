import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyFirebaseToken, adminDb, checkAdminRoleFromAdmin } from "@/lib/firebase/admin";

// Validation schema for university updates
const UniversitySchema = z.object({
  name: z.string().min(2, "University name must be at least 2 characters").optional(),
  shortCode: z.string().min(2).max(10).optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  city: z.string().min(2).optional(),
  type: z.enum(["public", "private", "international"]).optional(),
  established: z.number().int().optional(),
  website: z.string().url("Invalid website URL").optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  logo: z.string().url("Invalid image URL").optional(),
  banner: z.string().url("Invalid image URL").optional(),
  ranking: z.number().int().positive().optional(),
  programs: z.array(z.string()).optional(),
  admissionFee: z.number().positive().optional(),
  admissionDeadline: z.string().optional(),
});

// PATCH /api/admin/universities/[id] - Update a university
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedToken = await verifyFirebaseToken(request);

    if (!decodedToken || !(await checkAdminRoleFromAdmin(decodedToken.uid))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = UniversitySchema.parse(body);

    const docRef = adminDb.collection("universities").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    await docRef.update({
      ...validatedData,
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await docRef.get();

    return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating university:", error);
    return NextResponse.json(
      { error: "Failed to update university" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/universities/[id] - Delete a university
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedToken = await verifyFirebaseToken(request);

    if (!decodedToken || !(await checkAdminRoleFromAdmin(decodedToken.uid))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const docRef = adminDb.collection("universities").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting university:", error);
    return NextResponse.json(
      { error: "Failed to delete university" },
      { status: 500 }
    );
  }
}
