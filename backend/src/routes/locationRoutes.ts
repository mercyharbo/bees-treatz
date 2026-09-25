import { Router } from 'express';
import { getUkLocationsHandler } from '../controllers/locationController';

const router = Router();

// GET /api/locations/uk
router.get('/uk', getUkLocationsHandler);

export default router;
