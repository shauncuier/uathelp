import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/guard';
import { verifyFirebaseToken } from '@/lib/firebase/admin';
import { queryDocuments, addDocument, deleteDocument, getDocumentsByField } from '@/lib/firebase/database';
import { where } from 'firebase/firestore';
import { adminDb } from '@/lib/firebase/admin';

/**
 * GET /api/bookmarks
 * Get user's bookmarked universities
 */
async function handleGet(request: NextRequest) {
  try {
    const decodedToken = await verifyFirebaseToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decodedToken.uid;

    // Query saved_universities for this user from Firestore Admin
    const snapshot = await adminDb
      .collection('savedUniversities')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const bookmarks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
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
    const decodedToken = await verifyFirebaseToken(request);

    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decodedToken.uid;

    if (!universityId) {
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      );
    }

    // Check if already bookmarked
    const existingSnapshot = await adminDb
      .collection('savedUniversities')
      .where('userId', '==', userId)
      .where('universityId', '==', universityId)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { error: 'University already bookmarked' },
        { status: 409 }
      );
    }

    // Add bookmark
    const now = new Date().toISOString();
    const docRef = await adminDb.collection('savedUniversities').add({
      userId,
      universityId,
      createdAt: now,
    });

    return NextResponse.json(
      { data: { id: docRef.id, userId, universityId, createdAt: now } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to save bookmark' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/bookmarks
 * Remove a university from bookmarks (universityId in query params)
 */
async function handleDelete(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get('universityId');
    const decodedToken = await verifyFirebaseToken(request);

    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decodedToken.uid;

    if (!universityId) {
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      );
    }

    // Find and delete the bookmark
    const snapshot = await adminDb
      .collection('savedUniversities')
      .where('userId', '==', userId)
      .where('universityId', '==', universityId)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      );
    }

    // Delete all matching docs (should be only one)
    const batch = adminDb.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to remove bookmark' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleGet, { requireAuth: true });
export const POST = withAuth(handlePost, { requireAuth: true });
export const DELETE = withAuth(handleDelete, { requireAuth: true });
