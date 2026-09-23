import { Request, Response } from 'express';
import { calculateDeliveryEligibility, lookupUKPostcode } from '../services/deliveryService';
import { config } from '../config';

export async function validatePostcodeHandler(req: Request, res: Response): Promise<void> {
  try {
    const { postcode, subtotal } = req.body;

    if (!postcode || typeof postcode !== 'string') {
      res.status(400).json({ error: 'Postcode is required.' });
      return;
    }

    const subtotalNumber = typeof subtotal === 'number' ? subtotal : 0;
    const result = await calculateDeliveryEligibility(postcode, subtotalNumber);

    res.json({
      success: true,
      data: result,
      restaurantInfo: {
        postcode: config.delivery.restaurantPostcode,
        maxDistanceMiles: config.delivery.maxDistanceMiles,
        freeDeliveryThreshold: config.delivery.freeDeliveryThreshold,
      },
    });
  } catch (error) {
    console.error('validatePostcode error:', error);
    res.status(500).json({ error: 'Failed to validate postcode.' });
  }
}
