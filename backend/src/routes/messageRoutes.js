import { Router } from "express";
import {
  deleteMessage,
  getAllMessages,
  markAsRead,
  replyMessage,
  sendMessage,
  toggleStar,
} from "../controllers/messageController.js";
import { authorized } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.post("/send", sendMessage);

// Protected routes
router.get("/getall", authorized("admin"), getAllMessages);
router.delete("/:id/delete", authorized("admin"), deleteMessage);
router.post("/reply", authorized("admin"), replyMessage);
router.patch("/:id/read", authorized("admin"), markAsRead);
router.patch("/:id/star", authorized("admin"), toggleStar);

export default router;
