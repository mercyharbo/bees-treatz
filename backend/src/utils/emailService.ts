import { Resend } from 'resend';
import { config } from '../config';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// Initialize Resend transactional email client
const resend = new Resend(config.email.resendApiKey);

/**
 * Common HTML email wrapper for Bee's Treatz brand
 */
function wrapBrandTemplate(contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bee's Treatz</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; }
        .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .header { background: linear-gradient(135deg, #ea580c, #f97316, #f59e0b); padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0 0; color: rgba(255,255,255,0.9); font-size: 13px; font-weight: 500; }
        .content { padding: 32px 28px; line-height: 1.6; font-size: 15px; color: #334155; }
        .btn-container { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; background-color: #ea580c; color: #ffffff !important; padding: 14px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 15px; box-shadow: 0 4px 14px rgba(234,88,12,0.3); }
        .otp-box { background: #fff7ed; border: 2px dashed #f97316; border-radius: 14px; padding: 22px; text-align: center; margin: 26px 0; }
        .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #c2410c; margin: 0; font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; }
        .otp-sub { margin-top: 8px; font-size: 12px; color: #9a3412; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .notice-box { background: #f1f5f9; border-radius: 10px; padding: 14px 18px; margin: 24px 0 10px 0; font-size: 13px; color: #64748b; }
        .footer { padding: 20px 24px; background: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8; }
        .footer a { color: #ea580c; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bee's Treatz &#127855;</h1>
          <p>Authentic Nigerian Cuisine &bull; London, UK</p>
        </div>
        <div class="content">
          ${contentHtml}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Bee's Treatz Ltd. 48 Commercial Way, Peckham, London SE15 5BA.</p>
          <p>Delivering authentic Nigerian jollof, soups, and grills across South London.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Dispatches transactional emails via Resend
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  const isDev = config.nodeEnv !== 'production';

  // Always output nicely formatted log in local terminal for debugging
  console.log(`\n======================================================`);
  console.log(`📧 [DISPATCHING EMAIL VIA RESEND]`);
  console.log(`From:    ${config.email.from}`);
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`------------------------------------------------------`);
  console.log(text);
  console.log(`======================================================\n`);

  try {
    const response = await resend.emails.send({
      from: config.email.from,
      to: [to],
      subject,
      html,
      text,
    });

    if (response.error) {
      console.error('❌ Resend API error:', response.error);
      // If dev, return true so local testing can proceed even without internet
      return isDev;
    }

    console.log(`✅ Email delivered successfully via Resend. Message ID: ${response.data?.id}`);
    return true;
  } catch (err: any) {
    console.error('❌ Error sending email via Resend:', err?.message || err);
    return isDev;
  }
}

/**
 * Send email verification link
 */
export async function sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
  const verifyUrl = `${config.frontendUrl}/verify-email?token=${token}`;
  const subject = `Verify your email address - Bee's Treatz`;
  const text = `Hi ${name},\n\nThank you for signing up with Bee's Treatz! Please verify your email by clicking the link below:\n\n${verifyUrl}\n\nThis link will expire in 24 hours.\n\nIf you did not create this account, please ignore this email.`;

  const contentHtml = `
    <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Welcome to the Bee's Treatz Family! 🍯</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for creating an account with Bee's Treatz. We're thrilled to serve you the richest Nigerian jollof, slow-smoked suya, and traditional soups in London.</p>
    <p>To verify your email address and unlock all account features (including order tracking and loyalty points), please click the button below:</p>
    <div class="btn-container">
      <a href="${verifyUrl}" class="btn">Verify My Email Address</a>
    </div>
    <div class="notice-box">
      <strong>Button not working?</strong> Copy and paste this link into your browser:<br/>
      <a href="${verifyUrl}" style="color: #ea580c; word-break: break-all;">${verifyUrl}</a>
    </div>
    <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
      This link is valid for <strong>24 hours</strong>. If you did not create this account, you can safely disregard this email.
    </p>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html: wrapBrandTemplate(contentHtml),
  });
}

/**
 * Send password reset link
 */
export async function sendPasswordResetEmail(email: string, name: string, token: string): Promise<boolean> {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
  const subject = `Reset your password - Bee's Treatz`;
  const text = `Hi ${name},\n\nYou requested a password reset for your Bee's Treatz account. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this reset, your account is safe and you can ignore this email.`;

  const contentHtml = `
    <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Password Reset Request 🔐</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>We received a request to reset the password for your Bee's Treatz account associated with <strong>${email}</strong>.</p>
    <p>Click the button below to choose a new secure password:</p>
    <div class="btn-container">
      <a href="${resetUrl}" class="btn">Reset Password</a>
    </div>
    <div class="notice-box">
      <strong>Button not working?</strong> Copy and paste this link into your browser:<br/>
      <a href="${resetUrl}" style="color: #ea580c; word-break: break-all;">${resetUrl}</a>
    </div>
    <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
      This password reset link will expire in <strong>1 hour</strong> and can only be used once. If you didn't request a password reset, your credentials remain secure and you can safely ignore this email.
    </p>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html: wrapBrandTemplate(contentHtml),
  });
}

/**
 * Send 6-digit verification OTP code for changing password in profile
 */
export async function sendPasswordChangeCodeEmail(email: string, name: string, code: string): Promise<boolean> {
  const subject = `Your Password Change Code: ${code} - Bee's Treatz`;
  const text = `Hi ${name},\n\nYour 6-digit verification code to change your Bee's Treatz password is:\n\n${code}\n\nThis code will expire in 15 minutes.\n\nNever share this code with anyone. If you did not request this, please secure your account immediately.`;

  const contentHtml = `
    <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Security Verification Code 🛡️</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>You requested to update your account password on Bee's Treatz. Use the 6-digit verification code below to confirm this change:</p>
    
    <div class="otp-box">
      <div class="otp-code">${code}</div>
      <div class="otp-sub">Valid for 15 minutes</div>
    </div>

    <p style="font-size: 14px; color: #334155;">
      Enter this code in your browser to complete your password update.
    </p>

    <div class="notice-box">
      <strong>Security Reminder:</strong> Never share this code with anyone, including Bee's Treatz staff. We will never ask for your verification code.
    </div>

    <p style="font-size: 13px; color: #dc2626; font-weight: 500; margin-top: 20px;">
      If you did not initiate this request, someone may know your current password. Please sign into your account immediately to review your settings.
    </p>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html: wrapBrandTemplate(contentHtml),
  });
}

/**
 * Send security alert confirming password was successfully changed
 */
export async function sendPasswordChangedNotificationEmail(email: string, name: string): Promise<boolean> {
  const subject = `Your password was successfully updated - Bee's Treatz`;
  const text = `Hi ${name},\n\nThis is a confirmation that your Bee's Treatz account password was successfully changed.\n\nIf you performed this change, no further action is needed.\n\nIf you did not make this change, please contact us immediately.`;

  const contentHtml = `
    <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Password Successfully Changed ✅</h2>
    <p>Hi <strong>${name}</strong>,</p>
    <p>This is a security notification to confirm that your Bee's Treatz account password was successfully changed on <strong>${new Date().toUTCString()}</strong>.</p>
    
    <div class="notice-box" style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;">
      <strong>All Set:</strong> If you made this update, your new password is now active and you can use it to log in on all devices.
    </div>

    <p style="font-size: 13px; color: #dc2626; font-weight: 500; margin-top: 20px;">
      <strong>Didn't make this change?</strong> If you did not authorize this update, your account may be compromised. Please reset your password immediately via <a href="${config.frontendUrl}/forgot-password" style="color: #dc2626; text-decoration: underline;">Forgot Password</a> or reply directly to this email for urgent support.
    </p>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html: wrapBrandTemplate(contentHtml),
  });
}
