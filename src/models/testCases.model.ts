import mongoose from "mongoose";
import { QuestionDocument } from "./question.model";

const testCasesSchema = new mongoose.Schema({
  expectedOutput: { type: String, required: true },
  input: { type: String, required: true },
  number: { type: Number, required: true },
  hidden: { type: Boolean, default: false },
  time: { type: Number, default: 0 },
  memory: { type: Number, default: 0 },
  wildCardCode: { type: String, default: null },
  redeemed: { type: Boolean, default: false },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
});

export interface TestCaseDocument extends mongoose.Document {
  expectedOutput: string;
  input: string;
  number: number;
  time: number;
  memory: number;
  wildCardCode: string;
  hidden: boolean;
  question: QuestionDocument["_id"];
}

const TestCaseModel = mongoose.model<TestCaseDocument>(
  "TestCase",
  testCasesSchema
);
export default TestCaseModel;
