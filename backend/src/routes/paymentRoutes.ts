import { Router } from 'express';
import express from 'express';
import {
  createCheckoutSessionHandler,
  stripeWebhookHandler,
} from '../controllers/paymentController';

const router = Router();

// Create checkout session
router.post('/create-checkout-session', createCheckoutSessionHandler);

// Stripe webhook endpoint (requires raw body parser for signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

export default router;
