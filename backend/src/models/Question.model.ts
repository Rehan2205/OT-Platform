import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  test: mongoose.Types.ObjectId; // reference to Test
  questionText: string;
  options: string[];
  correctAnswer: string;
  marks: number;
}

const QuestionSchema: Schema<IQuestion> = new Schema(
  {
    test: { type: Schema.Types.ObjectId, ref: "Test", required: true },
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    marks: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IQuestion>("Question", QuestionSchema);
