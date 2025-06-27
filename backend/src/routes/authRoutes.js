import { Router } from "express";
import {
  forgotPassword,
  getProfile,
  login,
  register,
  resetPassword,
  updateProfile,
  verifyOTP,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

export default router;
