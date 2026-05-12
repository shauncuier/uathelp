import { Resend } from 'resend';

let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@uathelp.com';

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  verificationLink: string,
  fullName: string
) {
  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Verify your email - UAT Help',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to UAT Help, ${fullName}!</h1>
          <p style="color: #666; font-size: 16px;">
            Please verify your email address to activate your account and start exploring universities.
          </p>
          <p style="margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email
            </a>
          </p>
          <p style="color: #999; font-size: 14px;">
            Or copy and paste this link in your browser:
            <br />
            <small>${verificationLink}</small>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">
            This link will expire in 24 hours.
          </p>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetLink: string,
  fullName: string
) {
  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Reset your password - UAT Help',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Reset Your Password</h1>
          <p style="color: #666; font-size: 16px;">
            Hi ${fullName},
          </p>
          <p style="color: #666; font-size: 16px;">
            We received a request to reset your password. Click the button below to set a new password.
          </p>
          <p style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="color: #999; font-size: 14px;">
            Or copy and paste this link in your browser:
            <br />
            <small>${resetLink}</small>
          </p>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this, please ignore this email. Your password will not change unless you set a new one.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">
            This link will expire in 1 hour.
          </p>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string, fullName: string) {
  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Welcome to UAT Help!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to UAT Help! 🎉</h1>
          <p style="color: #666; font-size: 16px;">
            Hi ${fullName},
          </p>
          <p style="color: #666; font-size: 16px;">
            Your account has been verified and is now active. You can now:
          </p>
          <ul style="color: #666; font-size: 16px;">
            <li>Browse and filter 250+ Bangladeshi universities</li>
            <li>Chat with our AI admission assistant</li>
            <li>Save your favorite universities</li>
            <li>Track your applications</li>
            <li>Read admission circulars and blog posts</li>
          </ul>
          <p style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Dashboard
            </a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">
            Questions? Contact us at support@uathelp.com
          </p>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

/**
 * Send notification email
 */
export async function sendNotificationEmail(
  email: string,
  fullName: string,
  subject: string,
  message: string,
  actionUrl?: string,
  actionText?: string
) {
  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">${subject}</h1>
          <p style="color: #666; font-size: 16px;">
            Hi ${fullName},
          </p>
          <p style="color: #666; font-size: 16px;">
            ${message}
          </p>
          ${actionUrl ? `
            <p style="margin: 30px 0;">
              <a href="${actionUrl}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                ${actionText || 'View More'}
              </a>
            </p>
          ` : ''}
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">
            You're receiving this email because you enabled notifications in your account settings.
          </p>
        </div>
      `,
    });

    return result;
  } catch (error) {
    console.error('Failed to send notification email:', error);
    throw error;
  }
}
