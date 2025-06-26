import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updateResume,
  updateSkills,
  updateSocialLinks
} from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getProfile);

// Protected routes
router.put('/', authenticate, updateProfile);
router.put('/resume', authenticate, updateResume);
router.put('/skills', authenticate, updateSkills);
router.put('/social-links', authenticate, updateSocialLinks);

export default router;