import { Router } from 'express';
import { getTechStack } from '../controllers/techController.js';

const router = Router();

// Public route to get tech stack
router.get('/', getTechStack);

export default router;