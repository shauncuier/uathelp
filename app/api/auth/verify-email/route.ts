import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendVerificationEmail } from '@/lib/email';

/**
 * POST /api/auth/send-verification-email
 * Send verification email to user
 */
export async function POST(request: NextRequest) {
  try {
    const { email, fullName } = await request.json();
    const supabase = await createClient();

    if (!email || !fullName) {
      return NextResponse.json(
        { error: 'Email and full name are required' },
        { status: 400 }
      );
    }

    // Get the user from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + 
                             Math.random().toString(36).substring(2, 15);

    // Store verification token in database
    const { error: tokenError } = await supabase
      .from('verification_tokens')
      .insert({
        user_id: user.id,
        email,
        token: verificationToken,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

    if (tokenError) {
      console.error('Token storage error:', tokenError);
      return NextResponse.json(
        { error: 'Failed to generate verification token' },
        { status: 500 }
      );
    }

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

    const supabase = await createClient();

    // Find verification token
    const { data: verification, error: verifyError } = await supabase
      .from('verification_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (verifyError || !verification) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date(verification.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update user profile to mark as verified
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_verified: true })
      .eq('id', verification.user_id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to verify email' },
        { status: 500 }
      );
    }

    // Delete used token
    await supabase.from('verification_tokens').delete().eq('id', verification.id);

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
