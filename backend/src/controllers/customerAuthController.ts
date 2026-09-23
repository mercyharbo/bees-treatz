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
} from '../utils/security';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService';

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

const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

const ResendVerificationSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

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

    // Issue JWT: 30 days if rememberMe, 24 hours otherwise
    const tokenExpires = rememberMe ? '30d' : '24h';
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: 'customer',
      },
      config.jwt.secret,
      { expiresIn: tokenExpires as any }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        phone: user.phone,
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
