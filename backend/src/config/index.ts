import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'bees-treatz-secret-jwt-default',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  delivery: {
    restaurantPostcode: (process.env.RESTAURANT_POSTCODE || 'SE15 5BA').trim().toUpperCase(),
    maxDistanceMiles: parseFloat(process.env.MAX_DELIVERY_DISTANCE_MILES || '6.0'),
    baseFee: parseFloat(process.env.BASE_DELIVERY_FEE || '3.50'),
    perMileFee: parseFloat(process.env.PER_MILE_FEE || '0.80'),
    freeDeliveryThreshold: parseFloat(process.env.FREE_DELIVERY_THRESHOLD || '50.00'),
  },
  email: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    from: process.env.EMAIL_FROM || "Bee's Treatz <noreply@switftlink.live>",
  },
};
