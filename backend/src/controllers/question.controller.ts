import { Request, Response } from "express";
import Question from "../models/Question.model";
import Attempt from "../models/Attempt.model";
import Test from "../models/Test.model";

export const getQuestionsByTest = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ error: "Test not found" });

    const questions = await Question.find({ test: testId });

    res.json({
      questions,
      duration: test.duration,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

export const submitAttempt = async (req: Request, res: Response) => {
  try {
    const { testId, answers } = req.body;
    const userId = (req as any).userId; // authMiddleware sets this

    const existingAttempt = await Attempt.findOne({ test: testId, user: userId });
    if (existingAttempt) {
      return res.status(409).json({ error: "You have already attempted this test" });
    }

    const questions = await Question.find({ test: testId });
    let score = 0;
    const formattedAnswers = answers.map((a: any) => {
      const question = questions.find((q) => q._id.toString() === a.questionId);
      if (question && question.correctAnswer === a.answer) score += question.marks;
      return { question: a.questionId, selectedOption: a.answer };
    });

    const attempt = await Attempt.create({
      test: testId,
      user: userId,
      answers: formattedAnswers,
      score,
      submittedAt: new Date(),
    });

    res.json({ attemptId: attempt._id, score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit attempt" });
  }
};
