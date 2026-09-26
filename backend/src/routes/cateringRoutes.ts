import { Router } from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
} from '../controllers/cateringController';
import { requireAdminAuth } from '../middlewares/authMiddleware';
import { cateringInquiryLimiter } from '../middlewares/rateLimiter';

const router = Router();

// Public: Submit a bespoke catering inquiry
router.post('/inquire', cateringInquiryLimiter, createInquiry);

// Admin: View all catering inquiries
router.get('/inquiries', requireAdminAuth, getInquiries);

// Admin: Update status of an inquiry
router.patch('/inquiries/:id/status', requireAdminAuth, updateInquiryStatus);

export default router;
