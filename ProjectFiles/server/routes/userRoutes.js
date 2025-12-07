import express from "express";
import { fetchUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/fetch-users",authMiddleware, fetchUsers);

export default router;
