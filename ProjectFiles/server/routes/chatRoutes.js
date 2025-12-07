import express from "express";
import { fetchChats } from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/fetch-chats/:id", fetchChats); // Add authMiddleware
export default router;
