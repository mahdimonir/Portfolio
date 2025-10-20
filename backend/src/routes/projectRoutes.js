import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectBySlug,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { authorized } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getProjects); // Active projects & "?featured" projects

// Admin routes (must come before dynamic routes)
router.get("/all", authorized("admin"), getAllProjects);

// Dynamic routes (must come after specific routes)
router.get("/:slug", getProjectBySlug);

// Protected routes
router.post("/", authorized("admin"), createProject);
router.put("/:id", authorized("admin"), updateProject);
router.delete("/:id", authorized("admin"), deleteProject);

export default router;
