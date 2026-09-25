import { Router } from 'express';
import {
  registerCustomerHandler,
  loginCustomerHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  verifyEmailHandler,
  resendVerificationHandler,
  getCustomerProfileHandler,
  updateCustomerProfileHandler,
} from '../controllers/customerAuthController';
import { loginAdminHandler, getAdminProfileHandler } from '../controllers/authController';
import { requireCustomerAuth, requireAdminAuth } from '../middlewares/authMiddleware';
import {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  resendVerificationLimiter,
} from '../middlewares/rateLimiter';

const router = Router();

// ==========================================
// Customer Authentication Routes
// ==========================================

// Register new customer account
router.post('/register', registerLimiter, registerCustomerHandler);

// Authenticate customer account
router.post('/login', loginLimiter, loginCustomerHandler);

// Forgot password (request reset link)
router.post('/forgot-password', forgotPasswordLimiter, forgotPasswordHandler);

// Reset password (with token)
router.post('/reset-password', resetPasswordHandler);

// Verify email address (with token)
router.post('/verify-email', verifyEmailHandler);

// Resend verification email
router.post('/resend-verification', resendVerificationLimiter, resendVerificationHandler);

// Current customer profile
router.get('/me', requireCustomerAuth, getCustomerProfileHandler);

// Update customer profile & avatar
router.patch('/profile', requireCustomerAuth, updateCustomerProfileHandler);

// ==========================================
// Admin Authentication Routes
// ==========================================
router.post('/admin/login', loginLimiter, loginAdminHandler);
router.get('/admin/me', requireAdminAuth, getAdminProfileHandler);

export default router;
