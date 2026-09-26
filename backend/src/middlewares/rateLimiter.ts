import rateLimit from 'express-rate-limit';

/**
 * Brute-force protection for login attempts
 * Max 5 attempts per 15 minutes per IP
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Rate limiter for account creation to prevent spam and bot registrations
 * Max 5 registrations per hour per IP
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many accounts created from this IP. Please try again later.',
  },
});

/**
 * Rate limiter for password reset requests to prevent inbox flooding and enumeration
 * Max 3 requests per 15 minutes per IP
 */
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many password reset requests. Please wait 15 minutes before trying again.',
  },
});

/**
 * Rate limiter for email verification resend requests
 * Max 3 requests per 15 minutes per IP
 */
export const resendVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many verification emails requested. Please check your inbox or wait 15 minutes.',
  },
});

/**
 * Rate limiter for catering inquiry submissions to prevent spamming
 * Max 10 submissions per hour per IP
 */
export const cateringInquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many catering inquiries from this IP. Please try again later or contact us directly.',
  },
});
