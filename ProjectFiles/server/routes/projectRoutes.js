import express from "express";
import {
  fetchProject,
  fetchProjects,
  newProject,
  approveSubmission,
  rejectSubmission,
  submitProject,
} from "../controllers/projectController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// router.delete("/delete-project/:id", authMiddleware, deleteProject);
router.get("/fetch-project/:id", fetchProject);
router.get("/fetch-projects", fetchProjects);
router.post("/new-project", authMiddleware, newProject);
router.get("/approve-submission/:id", authMiddleware, approveSubmission);
router.get("/reject-submission/:id", authMiddleware, rejectSubmission);
router.post("/submit-project", authMiddleware, submitProject);

export default router;
