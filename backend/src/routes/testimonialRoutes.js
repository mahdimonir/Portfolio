import { Router } from "express";
import {
  createTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  getTestimonials,
  updateTestimonial,
} from "../controllers/testimonialController.js";
import { authorized } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getTestimonials);

// Protected routes
router.get("/all", authorized("admin"), getAllTestimonials);
router.post("/", authorized("admin"), createTestimonial);
router.put("/:id", authorized("admin"), updateTestimonial);
router.delete("/:id", authorized("admin"), deleteTestimonial);

export default router;
