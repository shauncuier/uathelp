import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth } from '@/lib/auth/guard';
import { createBlogSchema, updateBlogSchema } from '@/lib/validations';
import { logAuditAction } from '@/lib/auth/roles';

/**
 * GET /api/admin/blog
 * Get paginated list of blog posts
 */
async function handleGet(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const published = searchParams.get('published');

  try {
    const supabase = await createClient();

    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    if (published !== null) {
      query = query.eq('is_published', published === 'true');
    }

    const { data: posts, count, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/blog
 * Create a new blog post
 */
async function handlePost(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate input
    const validatedData = createBlogSchema.parse(body);

    // Check if slug is unique
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', validatedData.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // Create blog post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        ...validatedData,
        author_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log audit action
    await logAuditAction(user.id, 'CREATE', 'blog_post', post.id, validatedData);

    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/blog/[id]
 * Update a blog post
 */
async function handlePatch(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    const body = await request.json();
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate input
    const validatedData = updateBlogSchema.parse(body);

    // Check if slug is unique (if being updated)
    if (validatedData.slug) {
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', validatedData.slug)
        .neq('id', id)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update blog post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log audit action
    await logAuditAction(user.id, 'UPDATE', 'blog_post', id, validatedData);

    return NextResponse.json({ data: post });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/blog/[id]
 * Delete a blog post
 */
async function handleDelete(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete blog post
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log audit action
    await logAuditAction(user.id, 'DELETE', 'blog_post', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGet, { requireRole: 'moderator' });
export const POST = withAuth(handlePost, { requireRole: 'moderator' });
export const PATCH = withAuth(handlePatch, { requireRole: 'moderator' });
export const DELETE = withAuth(handleDelete, { requireRole: 'moderator' });
