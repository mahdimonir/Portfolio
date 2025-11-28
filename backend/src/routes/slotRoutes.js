import { Router } from "express";
import {
  createSlot,
  deleteSlot,
  getSlots,
  updateSlot,
} from "../controllers/slotController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

// Public route to get slots
router.get("/", getSlots);

// Protected routes (admin only)
router.use(verifyJWT);
router.post("/", createSlot);
router.patch("/:id", updateSlot);
router.delete("/:id", deleteSlot);

export default router;
