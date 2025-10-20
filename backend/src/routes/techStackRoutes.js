import express from "express";
import {
  createTech,
  deleteTech,
  getAllTechStacks,
  updateTech,
} from "../controllers/techStackController.js";
import { authorized } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllTechStacks);

// Protected routes
router.post("/", authorized("admin"), createTech);
router.patch("/:category/:name", authorized("admin"), updateTech);
router.delete("/:category/:name", authorized("admin"), deleteTech);

export default router;
