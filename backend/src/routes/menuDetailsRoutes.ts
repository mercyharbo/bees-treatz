import { Router } from 'express';
import { getMenuItemDetailsHandler } from '../controllers/menuController';

const router = Router();

// GET /api/menu-details/:slug (or ID)
router.get('/:slug', getMenuItemDetailsHandler);

export default router;
