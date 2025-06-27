import { Router } from "express";
import authRoutes from "./authRoutes.js";
// import profileRoutes from './profileRoutes.js';
// import projectRoutes from './projectRoutes.js';
// import articleRoutes from './articleRoutes.js';
// import testimonialRoutes from './testimonialRoutes.js';
// import experienceRoutes from './experienceRoutes.js';
// import techRoutes from './techRoutes.js';
import messageRoutes from "./messageRoutes.js";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
router.use("/auth", authRoutes);
// router.use('/profile', profileRoutes);
// router.use('/projects', projectRoutes);
// router.use('/articles', articleRoutes);
// router.use('/testimonials', testimonialRoutes);
// router.use('/experiences', experienceRoutes);
// router.use('/tech', techRoutes);
router.use("/message", messageRoutes);

export default router;
