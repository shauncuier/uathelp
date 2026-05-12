import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Validation schema for blog posts
const BlogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  content: z.string().min(100, "Content must be at least 100 characters"),
  category: z.enum(["guide", "rankings", "scholarships", "preparation", "news"]),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.string().optional(),
  coverImage: z.string().url("Invalid image URL").optional(),
  tags: z.array(z.string()).default([]),
  readTime: z.number().int().positive().optional(),
});

type BlogPost = z.infer<typeof BlogPostSchema>;

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

// GET /api/admin/blog - Get all blog posts
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
    const category = searchParams.get("category") || "";

    let query = supabase.from("blog_posts").select("*", { count: "exact" });

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,excerpt.ilike.%${search}%`
      );
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const { data, error, count } = await query
      .order("publishedAt", { ascending: false })
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
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog - Create a new blog post
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
    const validatedData = BlogPostSchema.parse(body);

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", validatedData.slug)
      .single();

    if (existingPost) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          ...validatedData,
          authorId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: validatedData.status === "published" ? new Date() : null,
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

    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}


