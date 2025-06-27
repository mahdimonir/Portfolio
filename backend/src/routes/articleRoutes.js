import { Router } from 'express';
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getCategories,
  getTags
} from '../controllers/articleController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getArticles);
router.get('/categories', getCategories);
router.get('/tags', getTags);
router.get('/:slug', getArticleBySlug);

// Protected routes
router.post('/', authenticate, createArticle);
router.put('/:id', authenticate, updateArticle);
router.delete('/:id', authenticate, deleteArticle);

export default router;