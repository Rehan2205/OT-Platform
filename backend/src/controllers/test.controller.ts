// src/controllers/test.controller.ts
import { Response } from "express";
import Test from "../models/Test.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// Create test
export const createTest = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, duration, totalMarks } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!duration || duration < 1) {
      return res.status(400).json({ error: "Duration must be greater than 0" });
    }


    const test = await Test.create({
      title,
      description,
      duration,
      totalMarks,
      createdBy: req.userId,
    });

    res.status(201).json(test);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create test" });
  }
};

// Get all tests for the logged-in user
export const getTests = async (req: AuthRequest, res: Response) => {
  try {
    const tests = await Test.find({ createdBy: req.userId }).sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch tests" });
  }
};

// ✅ Get a single test by ID
export const getTestById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    res.json(test);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch test" });
  }
};
