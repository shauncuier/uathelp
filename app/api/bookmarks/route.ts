import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth } from '@/lib/auth/guard';

/**
 * GET /api/bookmarks
 * Get user's bookmarked universities
 */
async function handleGet(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if saved_universities table exists, if not use fallback
    const { data: bookmarks, error } = await supabase
      .from('saved_universities')
      .select('university_id, universities(*), created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch bookmarks', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ data: bookmarks || [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bookmarks
 * Save a university to bookmarks
 */
async function handlePost(request: NextRequest) {
  try {
    const { universityId } = await request.json();
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!universityId) {
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      );
    }

    // Check if already bookmarked
    const { data: existing } = await supabase
      .from('saved_universities')
      .select('id')
      .eq('user_id', user.id)
      .eq('university_id', universityId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'University already bookmarked' },
        { status: 409 }
      );
    }

    // Add bookmark
    const { data: bookmark, error } = await supabase
      .from('saved_universities')
      .insert({
        user_id: user.id,
        university_id: universityId,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: bookmark }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save bookmark' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/bookmarks/[universityId]
 * Remove a university from bookmarks
 */
async function handleDelete(request: NextRequest, context: any) {
  try {
    const { universityId } = context.params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Remove bookmark
    const { error } = await supabase
      .from('saved_universities')
      .delete()
      .eq('user_id', user.id)
      .eq('university_id', universityId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove bookmark' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGet, { requireAuth: true });
export const POST = withAuth(handlePost, { requireAuth: true });
export const DELETE = withAuth(handleDelete, { requireAuth: true });
