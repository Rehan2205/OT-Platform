import express from "express";
import { getQuestionsByTest, submitAttempt } from "../controllers/question.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/:testId", authMiddleware, getQuestionsByTest);
router.post("/attempts", authMiddleware, submitAttempt);

export default router;
