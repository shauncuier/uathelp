import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth } from '@/lib/auth/guard';
import { createUniversitySchema, updateUniversitySchema } from '@/lib/validations';
import { logAuditAction } from '@/lib/auth/roles';

/**
 * GET /api/admin/universities
 * Get paginated list of universities
 */
async function handleGet(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  try {
    const supabase = await createClient();

    let query = supabase
      .from('universities')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
    }

    const { data: universities, count, error } = await query
      .order('name', { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      data: universities,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/universities
 * Create a new university
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
    const validatedData = createUniversitySchema.parse(body);

    // Check if slug is unique
    const { data: existing } = await supabase
      .from('universities')
      .select('id')
      .eq('slug', validatedData.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // Create university
    const { data: university, error } = await supabase
      .from('universities')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log audit action
    await logAuditAction(user.id, 'CREATE', 'university', university.id, validatedData);

    return NextResponse.json({ data: university }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/universities/[id]
 * Update a university
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
    const validatedData = updateUniversitySchema.parse(body);

    // Check if slug is unique (if being updated)
    if (validatedData.slug) {
      const { data: existing } = await supabase
        .from('universities')
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

    // Update university
    const { data: university, error } = await supabase
      .from('universities')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log audit action
    await logAuditAction(user.id, 'UPDATE', 'university', id, validatedData);

    return NextResponse.json({ data: university });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', issues: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update university' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/universities/[id]
 * Delete a university
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

    // Delete university
    const { error } = await supabase
      .from('universities')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log audit action
    await logAuditAction(user.id, 'DELETE', 'university', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete university' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGet, { requireRole: 'admin' });
export const POST = withAuth(handlePost, { requireRole: 'admin' });
export const PATCH = withAuth(handlePatch, { requireRole: 'admin' });
export const DELETE = withAuth(handleDelete, { requireRole: 'admin' });
