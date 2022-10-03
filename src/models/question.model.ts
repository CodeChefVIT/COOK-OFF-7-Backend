import mongoose from "mongoose";
import { TestCaseDocument } from "./testCases.model";

export interface QuestionDocument extends mongoose.Document {
  question: string;
  number: number;
  // difficulty: string;
  inputFormat: string[];
  outputFormat: string[];
  constraints: string[];
  sampleTestInput: string;
  sampleTestOutput: string;
  timeLimit: string;
  sourceLimit: string;
  testCases: TestCaseDocument["_id"][];
}

const questionSchema = new mongoose.Schema<QuestionDocument>({
  question: { type: String, required: true },
  number: { type: Number, required: true },
  inputFormat: [
    {type: String}
  ],
  outputFormat: [
    {type: String}
  ],
  constraints: [
    {
      type: String,
      required: true,
    },
  ],
  // sampleTestInput: { type: String, required: true },
  // sampleTestOutput: { type: String, required: true },
  // timeLimit: { type: String, required: true },
  // sourceLimit: { type: String, required: true },
  // difficulty: { type: String, required: true },
  testCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "TestCase" }],
});



const QuestionModel = mongoose.model<QuestionDocument>(
  "Question",
  questionSchema
);

export default QuestionModel;
