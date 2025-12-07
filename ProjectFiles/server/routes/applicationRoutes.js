import express from "express";
import {
  makeBid,
  fetchApplications,
  approveApplication,
  rejectApplication,
} from "../controllers/applicationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Place a bid
router.post("/make-bid", authMiddleware, makeBid);

// Fetch all applications
router.get("/fetch-applications", fetchApplications); // Should have authMiddleware
// Approve an application
router.get("/approve-application/:id", authMiddleware, approveApplication);

// Reject an application
router.get("/reject-application/:id", authMiddleware, rejectApplication);

export default router;
