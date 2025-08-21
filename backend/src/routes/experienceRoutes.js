import { Router } from "express";
import {
  createExperience,
  deleteExperience,
  getAllExperiences,
  getExperiences,
  updateExperience,
} from "../controllers/experienceController.js";
import { authorized } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getExperiences); // Active experiences only

// Protected routes
router.get("/all", authorized("admin"), getAllExperiences);
router.post("/", authorized("admin"), createExperience);
router.put("/:id", authorized("admin"), updateExperience);
router.delete("/:id", authorized("admin"), deleteExperience);

export default router;
