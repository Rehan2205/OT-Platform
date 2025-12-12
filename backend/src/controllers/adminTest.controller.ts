import { Response } from "express";
import Test from "../models/Test.model";
import Question from "../models/Question.model";
import { AdminRequest } from "../middlewares/adminAuth.middleware";

export const createAdminTest = async (req: AdminRequest, res: Response) => {
  try {
    const { title, duration, totalMarks, questions } = req.body;

    if (!req.adminId) {
      return res.status(401).json({ error: "Unauthorized admin" });
    }

    // 1) Create Test
    const test = await Test.create({
      title,
      description: "",
      duration,
      totalMarks,
      createdBy: req.adminId,
    });

    // 2) Create each question
    const questionDocs = [];

    for (const q of questions) {
      const correctAnswer =
        q.correctIndex !== null ? q.options[q.correctIndex] : "";

      const savedQ = await Question.create({
        test: test._id,
        questionText: q.text,
        options: q.options,
        correctAnswer,
        marks: q.marks,
      });

      questionDocs.push(savedQ._id);
    }

    // 3) Attach question IDs to test
    await Test.findByIdAndUpdate(test._id, {
      questions: questionDocs,
    });

    const finalTest = await Test.findById(test._id).populate("questions");

    res.status(201).json({
      message: "Test created successfully",
      test: finalTest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to create test" });
  }
};
