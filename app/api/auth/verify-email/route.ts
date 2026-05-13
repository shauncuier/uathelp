import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email';
import { verifyFirebaseToken, adminDb } from '@/lib/firebase/admin';

/**
 * POST /api/auth/verify-email
 * Send verification email to user
 */
export async function POST(request: NextRequest) {
  try {
    const { email, fullName } = await request.json();

    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Email and full name are required' },
        { status: 400 }
      );
    }

    // Verify user from Firebase token
    const decodedToken = await verifyFirebaseToken(request);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + 
                             Math.random().toString(36).substring(2, 15);

    // Store verification token in Firestore
    await adminDb.collection('verificationTokens').add({
      userId: decodedToken.uid,
      email,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    });

    // Create verification link
    const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email?token=${verificationToken}`;

    // Send email
    await sendVerificationEmail(email, verificationLink, fullName);

    return NextResponse.json({
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/verify-email?token=...
 * Verify email token
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find verification token in Firestore
    const snapshot = await adminDb
      .collection('verificationTokens')
      .where('token', '==', token)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    const verificationDoc = snapshot.docs[0];
    const verification = verificationDoc.data();

    // Check if token is expired
    if (new Date(verification.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update user profile to mark as verified
    await adminDb
      .collection('profiles')
      .doc(verification.userId)
      .update({ isVerified: true, updatedAt: new Date().toISOString() });

    // Delete used token
    await verificationDoc.ref.delete();

    return NextResponse.json({
      message: 'Email verified successfully',
      verified: true,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
