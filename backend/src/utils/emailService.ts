import { config } from '../config';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Dispatches transactional emails (e.g. Email verification, Password reset)
 * In development, neatly logs the formatted link to console for immediate local testing.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  const isDev = config.nodeEnv !== 'production';

  if (isDev) {
    console.log(`\n======================================================`);
    console.log(`📧 [MOCK EMAIL SERVICE]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`------------------------------------------------------`);
    console.log(text);
    console.log(`======================================================\n`);
    return true;
  }

  // In production, integrate transactional provider (Resend, SendGrid, Postmark, AWS SES)
  // e.g.: await resend.emails.send({ from: 'noreply@beestreatz.co.uk', to, subject, html });
  return true;
}

/**
 * Send email verification link
 */
export async function sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
  const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`;
  const subject = `Verify your email address - Bee's Treatz`;
  const text = `Hi ${name},\n\nThank you for signing up with Bee's Treatz! Please verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link will expire in 24 hours.\n\nIf you did not create this account, please ignore this email.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Welcome to Bee's Treatz! 🍯</h2>
      <p>Hi ${name},</p>
      <p>Please click the button below to verify your email address:</p>
      <p style="margin: 24px 0;">
        <a href="${verifyUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Verify Email
        </a>
      </p>
      <p style="color: #666; font-size: 13px;">Or copy and paste this URL into your browser:<br/><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p style="color: #999; font-size: 12px;">This link will expire in 24 hours.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
}

/**
 * Send password reset link
 */
export async function sendPasswordResetEmail(email: string, name: string, token: string): Promise<boolean> {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
  const subject = `Reset your password - Bee's Treatz`;
  const text = `Hi ${name},\n\nYou requested a password reset for your Bee's Treatz account. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this reset, your account is safe and you can ignore this email.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Password Reset Request 🔐</h2>
      <p>Hi ${name},</p>
      <p>Click the button below to set a new password for your Bee's Treatz account:</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p style="color: #666; font-size: 13px;">Or copy and paste this URL into your browser:<br/><a href="${resetUrl}">${resetUrl}</a></p>
      <p style="color: #999; font-size: 12px;">This link will expire in 1 hour. It can only be used once.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
}
