import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

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

// PATCH /api/admin/blog/[id] - Update a blog post
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
    const validatedData = BlogPostSchema.parse(body);

    // If slug is being changed, check if new slug exists
    if (validatedData.slug) {
      const { data: existingPost } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", validatedData.slug)
        .neq("id", id)
        .single();

      if (existingPost) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        ...validatedData,
        updatedAt: new Date(),
        publishedAt:
          validatedData.status === "published"
            ? new Date()
            : null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: "Blog post not found" },
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
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
