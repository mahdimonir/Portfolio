import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogBySlug,
  getBlogs,
  updateBlog,
} from "../controllers/blogController.js";
import { authorized } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getBlogs); // Active blogs only
router.get("/slug/:slug", getBlogBySlug);

// Protected routes
router.get("/all", authorized("admin"), getAllBlogs);
router.post("/", authorized("admin"), createBlog);
router.put("/:id", authorized("admin"), updateBlog);
router.delete("/:id", authorized("admin"), deleteBlog);

export default router;
