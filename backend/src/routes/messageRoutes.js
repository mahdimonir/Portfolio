import { Router } from "express";
import {
  deleteMessage,
  getAllMessages,
  sendMessage,
} from "../controllers/messageController.js";

const router = Router();

router.post("/send", sendMessage);
router.get("/getall", getAllMessages);
router.delete("/delete", deleteMessage);

export default router;
