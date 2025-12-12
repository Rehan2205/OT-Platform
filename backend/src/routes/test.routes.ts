// src/routes/test.routes.ts
import express from "express";
import { createTest, getTests, getTestById } from "../controllers/test.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

// Create test
router.post("/", authMiddleware, createTest);

// Get all tests
router.get("/", authMiddleware, getTests);

// ✅ Get test by ID
router.get("/:id", authMiddleware, getTestById);

export default router;
