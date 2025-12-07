import express from "express";
import {
  fetchFreelancer,
  updateFreelancer,
} from "../controllers/freelancerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
// Make sure you have these routes
router.get("/fetch-freelancer/:id", fetchFreelancer);
router.post("/update-freelancer", updateFreelancer); // This should exist!// ✅ This should exist

export default router;
