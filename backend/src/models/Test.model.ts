// import mongoose, { Schema, Document } from "mongoose";

// export interface ITest extends Document {
//   title: string;
//   description: string;
//   duration: number;
//   totalMarks: number;
//   createdBy: mongoose.Types.ObjectId;
//   isActive: boolean;
// }

// const TestSchema: Schema<ITest> = new Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     duration: { type: Number, required: true },
//     totalMarks: { type: Number, required: true },
//     createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model<ITest>("Test", TestSchema);


















import mongoose, { Schema, Document } from "mongoose";

export interface ITest extends Document {
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  createdBy: mongoose.Types.ObjectId;
  questions: mongoose.Types.ObjectId[];
}

const TestSchema: Schema<ITest> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    duration: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

export default mongoose.model<ITest>("Test", TestSchema);
