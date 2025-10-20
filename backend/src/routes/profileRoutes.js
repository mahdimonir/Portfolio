import { Router } from "express";
import {
  changePassword,
  getProfile,
  getPublicProfile,
  updateAvatar,
  updateProfile,
  updateProfileDetails,
  updateResume,
} from "../controllers/profileController.js";
import { authorized } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/public", getPublicProfile);

// Protected routes
router.get("/", authorized("admin"), getProfile);
router.put("/update", authorized("admin"), updateProfile);
router.patch("/details", authorized("admin"), updateProfileDetails);
router.patch("/avatar", authorized("admin"), updateAvatar);
router.patch("/resume", authorized("admin"), updateResume);
router.patch("/update-password", authorized("admin"), changePassword);
export default router;
