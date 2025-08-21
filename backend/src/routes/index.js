import { Router } from "express";
import authRoutes from "./authRoutes.js";
import blogRoutes from "./blogRoutes.js";
import experienceRoutes from "./experienceRoutes.js";
import messageRoutes from "./messageRoutes.js";
import profileRoutes from "./profileRoutes.js";
import projectRoutes from "./projectRoutes.js";
import serviceRoutes from "./serviceRoutes.js";
import techStackRoutes from "./techStackRoutes.js";
import testimonialRoutes from "./testimonialRoutes.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
router.use("/auth", authRoutes);
router.use("/me", profileRoutes);
router.use("/techstack", techStackRoutes);
router.use("/projects", projectRoutes);
router.use("/blogs", blogRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/experiences", experienceRoutes);
router.use("/services", serviceRoutes);
router.use("/messages", messageRoutes);

export default router;
