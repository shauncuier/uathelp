import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryDocuments, addDocument, getDocument } from "@/lib/firebase/database";
import { checkAdminRole } from "@/lib/firebase/server";
import { where } from "firebase/firestore";

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

// GET /api/admin/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement Firebase Admin SDK for authentication
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";

    // Build query constraints
    const constraints = [];
    
    if (status) {
      constraints.push(where("status", "==", status));
    }

    if (category) {
      constraints.push(where("category", "==", category));
    }

    // Get all blog posts
    let posts = await queryDocuments("blogPosts", constraints);

    // Filter by search text on client side
    if (search) {
      posts = posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.excerpt?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by published date
    posts.sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    );

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    const paginatedData = posts.slice(offset, offset + limitNum);

    return NextResponse.json({
      data: paginatedData,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: posts.length,
        pages: Math.ceil(posts.length / limitNum),
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
    // TODO: Implement Firebase Admin SDK for authentication
    
    const body = await request.json();
    const validatedData = BlogPostSchema.parse(body);

    // Check if slug already exists
    const existingPosts = await queryDocuments("blogPosts", [
      where("slug", "==", validatedData.slug)
    ]);

    if (existingPosts.length > 0) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const postId = await addDocument("blogPosts", {
      ...validatedData,
      authorId: "user.id", // TODO: Replace with actual user ID from auth
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: validatedData.status === "published" ? new Date().toISOString() : null,
    });

    return NextResponse.json(
      { id: postId, ...validatedData },
      { status: 201 }
    );
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


