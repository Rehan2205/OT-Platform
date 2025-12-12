import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getAttemptById,
  checkAttemptExists,
} from "../controllers/attempt.controller";

const router = express.Router();

// Check if user already attempted a specific test
router.get("/check/:testId", authMiddleware, checkAttemptExists);

// Get attempt by attemptId
router.get("/:id", authMiddleware, getAttemptById);

export default router;
