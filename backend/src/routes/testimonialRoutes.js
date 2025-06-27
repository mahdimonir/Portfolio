import { Router } from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  updateOrder
} from '../controllers/testimonialController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getTestimonials);

// Protected routes
router.post('/', authenticate, createTestimonial);
router.put('/:id', authenticate, updateTestimonial);
router.delete('/:id', authenticate, deleteTestimonial);
router.put('/order/bulk', authenticate, updateOrder);

export default router;