import { Router } from 'express';
import {
  createOrderHandler,
  getOrderByIdHandler,
  getAllOrdersHandler,
  updateOrderStatusHandler,
} from '../controllers/orderController';
import { requireAdminAuth } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.post('/', createOrderHandler);
router.get('/:id', getOrderByIdHandler);

// Admin routes
router.get('/', requireAdminAuth, getAllOrdersHandler);
router.patch('/:id/status', requireAdminAuth, updateOrderStatusHandler);

export default router;
