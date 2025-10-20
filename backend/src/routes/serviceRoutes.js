import { Router } from "express";
import {
  createService,
  deleteService,
  getAllServices,
  getServiceBySlug,
  getServices,
  updateService,
} from "../controllers/serviceController.js";
import { authorized } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getServices);
router.get("/slug/:slug", getServiceBySlug);

// Protected routes
router.get("/all", authorized("admin"), getAllServices);
router.post("/", authorized("admin"), createService);
router.put("/:id", authorized("admin"), updateService);
router.delete("/:id", authorized("admin"), deleteService);

export default router;
