import Stripe from 'stripe';
import { config } from '../config';

export const stripe = config.stripe.secretKey && !config.stripe.secretKey.includes('placeholder')
  ? new Stripe(config.stripe.secretKey, {
      apiVersion: '2024-11-20.acacia' as any,
    })
  : null;

export const isStripeConfigured = (): boolean => {
  return stripe !== null;
};
