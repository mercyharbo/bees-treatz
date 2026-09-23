import { Router } from 'express';
import { validatePostcodeHandler } from '../controllers/deliveryController';

const router = Router();

router.post('/validate-postcode', validatePostcodeHandler);

export default router;
