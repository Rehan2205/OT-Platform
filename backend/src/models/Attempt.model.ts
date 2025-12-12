import mongoose, { Schema, Document } from "mongoose";

interface IAnswer {
  question: mongoose.Types.ObjectId;
  selectedOption: string;
}

export interface IAttempt extends Document {
  user: mongoose.Types.ObjectId;
  test: mongoose.Types.ObjectId;
  answers: IAnswer[];
  score?: number;
  submittedAt?: Date;
}

const AttemptSchema: Schema<IAttempt> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    test: { type: Schema.Types.ObjectId, ref: "Test", required: true },
    answers: [
      {
        question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
        selectedOption: { type: String, required: true },
      },
    ],
    score: { type: Number, default: 0 },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IAttempt>("Attempt", AttemptSchema);
