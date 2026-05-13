import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyFirebaseToken, adminDb, checkAdminRoleFromAdmin } from "@/lib/firebase/admin";

// Validation schema for blog posts
const BlogPostSchema = z.object({
  title: z.string().min(5).optional(),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: z.string().min(20).optional(),
  content: z.string().min(100).optional(),
  category: z.enum(["guide", "rankings", "scholarships", "preparation", "news"]).optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published"]).optional(),
  publishedAt: z.string().optional(),
  coverImage: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  readTime: z.number().int().positive().optional(),
});

// PATCH /api/admin/blog/[id] - Update a blog post
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
    const validatedData = BlogPostSchema.parse(body);

    const docRef = adminDb.collection("blogPosts").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // If slug is being changed, check if new slug exists
    if (validatedData.slug) {
      const existingSnapshot = await adminDb
        .collection("blogPosts")
        .where("slug", "==", validatedData.slug)
        .get();

      const otherWithSlug = existingSnapshot.docs.find((doc) => doc.id !== id);
      if (otherWithSlug) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();
    await docRef.update({
      ...validatedData,
      updatedAt: now,
      publishedAt: validatedData.status === "published" ? now : null,
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

    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/[id] - Delete a blog post
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

    const docRef = adminDb.collection("blogPosts").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
