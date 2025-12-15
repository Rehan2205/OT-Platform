// src/routes/test.routes.ts
import express from "express";
import { createTest, getTests, getTestById } from "../controllers/test.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
// import Test from "../models/Test";
import Test from "../models/Test.model"

const router = express.Router();

// Create test
router.post("/", authMiddleware, createTest);

// Get all tests
router.get("/", authMiddleware, getTests);

// ✅ Get test by ID
router.get("/:id", authMiddleware, getTestById);

router.post("/tests", async (req, res) => {
  try {
    const { title, duration, totalMarks, questions } = req.body;

    if (!duration) {
      return res.status(400).json({ error: "Duration is required" });
    }

    const test = new Test({
      title,
      duration,
      totalMarks,
      questions
    });

    await test.save();
    res.status(201).json({ message: "Test created successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create test" });
  }
});

export default router;
