import { Router } from 'express';
import {
  getMenuHandler,
  getMenuItemHandler,
  toggleItemAvailabilityHandler,
} from '../controllers/menuController';
import { requireAdminAuth } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', getMenuHandler);
router.get('/:id', getMenuItemHandler);

// Admin route
router.patch('/:id/availability', requireAdminAuth, toggleItemAvailabilityHandler);

export default router;
