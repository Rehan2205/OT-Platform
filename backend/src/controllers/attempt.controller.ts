// src/controllers/attempt.controller.ts
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware"; // import the extended type
import Attempt from "../models/Attempt.model";
import Test from "../models/Test.model";

export const checkAttemptExists = async (req: AuthRequest, res: Response) => {
  try {
    const { testId } = req.params;
    const userId = req.userId; // now TS knows this exists

    const attempt = await Attempt.findOne({ test: testId, user: userId });
    res.json({ attempted: !!attempt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check attempt" });
  }
};

// Similarly, in other functions that use req.userId:
export const getAttemptById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const attempt = await Attempt.findById(id);
    if (!attempt) return res.status(404).json({ error: "Attempt not found" });
    res.json(attempt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attempt" });
  }
};
