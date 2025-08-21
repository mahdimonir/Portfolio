import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyOTP,
} from "../controllers/authController.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
