import { Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { config } from '../config';
import {
  generateRandomToken,
  hashToken,
  hashPassword,
  verifyPassword,
  performDummyBcryptCompare,
  normalizeEmail,
  generateNumericOtp,
} from '../utils/security';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangeCodeEmail,
  sendPasswordChangedNotificationEmail,
} from '../utils/emailService';

// Password complexity: minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, and 1 special symbol
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\[\]]).{8,}$/;

const RegisterSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(strongPasswordRegex, 'Password must include uppercase, lowercase, number, and special character'),
});

const LoginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

const ForgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100)
      .regex(strongPasswordRegex, 'Password must include uppercase, lowercase, number, and special character'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const RequestPasswordChangeCodeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
});

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100)
      .regex(strongPasswordRegex, 'Password must include uppercase, lowercase, number, and special character'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    code: z.string().trim().length(6, 'Verification code must be 6 digits'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

const ResendVerificationSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

const UpdateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  address: z.string().trim().max(255).nullable().optional(),
  city: z.string().trim().max(100).nullable().optional(),
  state: z.string().trim().max(100).nullable().optional(),
  postcode: z.string().trim().max(20).nullable().optional(),
});

/**
 * Helper to parse cookies from incoming Express request headers
 */
function parseCookies(req: Request): Record<string, string> {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc, item) => {
    const [key, ...v] = item.trim().split('=');
    if (key) acc[key] = decodeURIComponent(v.join('='));
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Issues a 15-minute access token and a 30-day cryptographically hashed refresh token
 */
async function issueCustomerTokens(userId: string, email: string) {
  const accessToken = jwt.sign(
    { userId, email, role: 'customer' },
    config.jwt.secret,
    { expiresIn: '15m' }
  );

  const rawRefreshToken = generateRandomToken();
  const tokenHash = hashToken(rawRefreshToken);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return { accessToken, refreshToken: rawRefreshToken };
}

/**
 * Sets dual-token authentication cookies on the HTTP response
 */
function setCustomerAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  const isProd = process.env.NODE_ENV === 'production';
  const accessMaxAge = 15 * 60; // 15 mins in seconds
  const refreshMaxAge = 30 * 24 * 60 * 60; // 30 days in seconds
  const secureFlag = isProd ? '; Secure' : '';

  res.setHeader('Set-Cookie', [
    `bt_auth_token=${encodeURIComponent(accessToken)}; Path=/; Max-Age=${accessMaxAge}; SameSite=Lax${secureFlag}`,
    `bt_refresh_token=${encodeURIComponent(refreshToken)}; Path=/; Max-Age=${refreshMaxAge}; HttpOnly; SameSite=Lax${secureFlag}`,
  ]);
}

/**
 * Clears authentication cookies upon session expiry or logout
 */
function clearCustomerAuthCookies(res: Response) {
  res.setHeader('Set-Cookie', [
    'bt_auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax',
    'bt_refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
  ]);
}

/**
 * POST /api/auth/register
 * Creates a customer account, hashes password, generates zero-knowledge verification token
 */
export async function registerCustomerHandler(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: parseResult.error.errors[0]?.message || 'Validation error',
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, email, password } = parseResult.data;
    const normalized = normalizeEmail(email);

    // Check if account already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalized },
    });

    if (existingUser) {
      res.status(400).json({ error: 'An account with this email address already exists. Please sign in.' });
      return;
    }

    // Hash password with bcrypt cost factor 12
    const passwordHash = await hashPassword(password);

    // Generate cryptographically secure verification token (256-bit entropy)
    const rawVerifyToken = generateRandomToken();
    const hashedVerifyToken = hashToken(rawVerifyToken);
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        name,
        email: normalized,
        passwordHash,
        emailVerifyToken: hashedVerifyToken,
        emailVerifyExpires: verifyExpires,
        isEmailVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    // Dispatch verification email (logs link in development)
    await sendVerificationEmail(normalized, name, rawVerifyToken);

    res.status(201).json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
      user,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error while creating account.' });
  }
}

/**
 * POST /api/auth/login
 * Authenticates customer, enforces lockout, timing attack mitigation, and issues signed JWT
 */
export async function loginCustomerHandler(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: parseResult.error.errors[0]?.message || 'Invalid login details',
      });
      return;
    }

    const { email, password, rememberMe } = parseResult.data;
    const normalized = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: normalized },
    });

    // Timing attack defense: if user doesn't exist, execute dummy comparison
    if (!user) {
      await performDummyBcryptCompare(password);
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Account lockout defense: check if user is temporarily locked out
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / (60 * 1000));
      res.status(423).json({
        error: `Account temporarily locked due to repeated failed logins. Please try again in ${remainingMinutes} minute(s).`,
      });
      return;
    }

    const isMatch = await verifyPassword(password, user.passwordHash);

    if (!isMatch) {
      const nextFailedCount = user.failedLoginAttempts + 1;
      // 5 consecutive failures triggers 15-minute temporary lockout
      if (nextFailedCount >= 5) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockoutUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes lockout
          },
        });
        res.status(423).json({
          error: 'Too many failed login attempts. Your account has been temporarily locked for 15 minutes.',
        });
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: nextFailedCount },
      });

      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Reset failed attempts, update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // Issue Dual Tokens: 15-minute access token + 30-day refresh token with rotation
    const { accessToken, refreshToken } = await issueCustomerTokens(user.id, user.email);
    setCustomerAuthCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        address: user.address,
        city: user.city,
        state: user.state,
        postcode: user.postcode,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}

/**
 * POST /api/auth/forgot-password
 * Generates single-use, SHA-256 hashed password reset token with 1-hour expiration.
 * Always returns a generic response to prevent user enumeration.
 */
export async function forgotPasswordHandler(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = ForgotPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const { email } = parseResult.data;
    const normalized = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: normalized },
    });

    if (user) {
      const rawToken = generateRandomToken();
      const hashedToken = hashToken(rawToken);
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpires: resetExpires,
        },
      });

      await sendPasswordResetEmail(normalized, user.name, rawToken);
    }

    // Always respond with identical safe message to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account with that email exists, we have sent password reset instructions.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error processing password reset.' });
  }
}

/**
 * POST /api/auth/reset-password
 * Verifies token hash, checks expiration, updates password hash, and invalidates token
 */
export async function resetPasswordHandler(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = ResetPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: parseResult.error.errors[0]?.message || 'Validation error',
      });
      return;
    }

    const { token, password } = parseResult.data;
    const hashedToken = hashToken(token);

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({
        error: 'Invalid or expired password reset link. Please request a new one.',
      });
      return;
    }

    const passwordHash = await hashPassword(password);

    // Invalidate reset token immediately and clear any failed login lockouts
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });

    res.json({
      success: true,
      message: 'Your password has been reset successfully. You can now sign in.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error updating password.' });
  }
}

/**
 * POST /api/auth/verify-email
 * Verifies user email via SHA-256 token hash lookup
 */
export async function verifyEmailHandler(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = VerifyEmailSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Verification token is required.' });
      return;
    }

    const { token } = parseResult.data;
    const hashedToken = hashToken(token);

    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: hashedToken,
        emailVerifyExpires: { gt: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({
        error: 'Invalid or expired email verification link.',
      });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });

    res.json({
      success: true,
      message: 'Email verified successfully! Your account is active.',
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal server error verifying email.' });
  }
}

/**
 * POST /api/auth/resend-verification
 * Resends a fresh email verification link if account is unverified
 */
export async function resendVerificationHandler(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = ResendVerificationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const { email } = parseResult.data;
    const normalized = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: normalized },
    });

    if (user && !user.isEmailVerified) {
      const rawToken = generateRandomToken();
      const hashedToken = hashToken(rawToken);
      const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerifyToken: hashedToken,
          emailVerifyExpires: verifyExpires,
        },
      });

      await sendVerificationEmail(normalized, user.name, rawToken);
    }

    // Generic safe response to prevent email enumeration
    res.json({
      success: true,
      message: 'If an unverified account with that email exists, a fresh verification link has been sent.',
    });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Internal server error resending verification link.' });
  }
}

/**
 * GET /api/auth/me
 * Retrieves current authenticated customer profile
 */
export async function getCustomerProfileHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        address: true,
        city: true,
        state: true,
        postcode: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User profile not found.' });
      return;
    }

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error fetching profile.' });
  }
}

/**
 * PATCH /api/auth/profile
 * Updates the authenticated customer profile details & avatar
 */
export async function updateCustomerProfileHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const parseResult = UpdateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: parseResult.error.errors[0]?.message || 'Invalid input data',
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, phone, avatarUrl, address, city, state, postcode } = parseResult.data;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone ? phone.trim() : null }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl ? avatarUrl.trim() : null }),
        ...(address !== undefined && { address: address ? address.trim() : null }),
        ...(city !== undefined && { city: city ? city.trim() : null }),
        ...(state !== undefined && { state: state ? state.trim() : null }),
        ...(postcode !== undefined && { postcode: postcode ? postcode.trim().toUpperCase() : null }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        address: true,
        city: true,
        state: true,
        postcode: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error updating profile.' });
  }
}

/**
 * POST /api/auth/change-password/request-code
 * Validates current password, generates 6-digit OTP code, and dispatches via Resend
 */
export async function requestPasswordChangeCodeHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const parseResult = RequestPasswordChangeCodeSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0]?.message || 'Current password is required' });
      return;
    }

    const { currentPassword } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User account not found' });
      return;
    }

    // Verify current password before generating OTP
    const isMatch = await verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ error: 'Incorrect current password. Please try again.' });
      return;
    }

    // Generate 6-digit numeric OTP and 15-minute expiration
    const otpCode = generateNumericOtp(6);
    const hashedCode = hashToken(otpCode);
    const codeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordChangeCode: hashedCode,
        passwordChangeExpires: codeExpires,
      },
    });

    // Dispatch email via Resend
    await sendPasswordChangeCodeEmail(user.email, user.name, otpCode);

    res.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${user.email}.`,
    });
  } catch (error: any) {
    console.error('Request password change code error:', error);
    res.status(500).json({ error: 'Internal server error requesting verification code.' });
  }
}

/**
 * POST /api/auth/change-password
 * Verifies 6-digit OTP code + current password, updates to new password, and notifies user
 */
export async function changePasswordHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const parseResult = ChangePasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: parseResult.error.errors[0]?.message || 'Validation error',
      });
      return;
    }

    const { currentPassword, newPassword, code } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User account not found' });
      return;
    }

    // Verify current password
    const isCurrentPasswordCorrect = await verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentPasswordCorrect) {
      res.status(400).json({ error: 'Incorrect current password.' });
      return;
    }

    // Check if new password is same as current password
    const isSamePassword = await verifyPassword(newPassword, user.passwordHash);
    if (isSamePassword) {
      res.status(400).json({ error: 'New password must be different from your current password.' });
      return;
    }

    // Verify OTP code
    const hashedCode = hashToken(code);
    if (!user.passwordChangeCode || user.passwordChangeCode !== hashedCode) {
      res.status(400).json({ error: 'Invalid verification code. Please check the code sent to your email.' });
      return;
    }

    if (!user.passwordChangeExpires || user.passwordChangeExpires < new Date()) {
      res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
      return;
    }

    // Hash new password and clear OTP
    const newPasswordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        passwordChangeCode: null,
        passwordChangeExpires: null,
      },
    });

    // Send security notification email
    await sendPasswordChangedNotificationEmail(user.email, user.name);

    res.json({
      success: true,
      message: 'Your password has been changed successfully.',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error changing password.' });
  }
}

/**
 * POST /api/auth/refresh
 * Validates the refresh token (from cookie or JSON body), rotates it in DB,
 * and issues a fresh 15-minute access token + new 30-day rotated refresh token.
 */
export async function refreshCustomerTokenHandler(req: Request, res: Response): Promise<void> {
  try {
    const cookies = parseCookies(req);
    const rawRefreshToken = cookies.bt_refresh_token || req.body?.refreshToken;

    if (!rawRefreshToken || typeof rawRefreshToken !== 'string') {
      clearCustomerAuthCookies(res);
      res.status(401).json({ error: 'Refresh token is required.' });
      return;
    }

    const tokenHash = hashToken(rawRefreshToken);
    const existingToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!existingToken || existingToken.revoked || existingToken.expiresAt < new Date()) {
      clearCustomerAuthCookies(res);
      res.status(401).json({ error: 'Session has expired. Please log in again.' });
      return;
    }

    // Revoke old token immediately (Rotation to prevent replay attacks)
    await prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { revoked: true },
    });

    // Issue new dual tokens
    const { accessToken, refreshToken: newRefreshToken } = await issueCustomerTokens(
      existingToken.user.id,
      existingToken.user.email
    );

    setCustomerAuthCookies(res, accessToken, newRefreshToken);

    res.json({
      success: true,
      token: accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: existingToken.user.id,
        name: existingToken.user.name,
        email: existingToken.user.email,
        isEmailVerified: existingToken.user.isEmailVerified,
        phone: existingToken.user.phone,
        avatarUrl: existingToken.user.avatarUrl,
        address: existingToken.user.address,
        city: existingToken.user.city,
        state: existingToken.user.state,
        postcode: existingToken.user.postcode,
      },
    });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Failed to refresh authentication session.' });
  }
}

/**
 * POST /api/auth/logout
 * Revokes the refresh token in the database and clears cookies.
 */
export async function logoutCustomerHandler(req: Request, res: Response): Promise<void> {
  try {
    const cookies = parseCookies(req);
    const rawRefreshToken = cookies.bt_refresh_token || req.body?.refreshToken;

    if (rawRefreshToken && typeof rawRefreshToken === 'string') {
      const tokenHash = hashToken(rawRefreshToken);
      await prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { revoked: true },
      });
    }

    clearCustomerAuthCookies(res);
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    clearCustomerAuthCookies(res);
    res.json({ success: true });
  }
}


