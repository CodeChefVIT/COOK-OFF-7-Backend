import mongoose from "mongoose";
import { QuestionDocument } from "./question.model";

const testCasesSchema = new mongoose.Schema({
    expectedOutput: { type: String, required: true },
    input: { type: String, required: true },
    hidden: { type: Boolean, default: false },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" }
    // ! Memory here or in question?
});

export interface TestCaseDocument extends mongoose.Document {
    expectedOutput: string;
    input: string;
    hidden: boolean;
    question: QuestionDocument["_id"];
}

const TestCaseModel = mongoose.model<TestCaseDocument>("TestCase", testCasesSchema);
export default TestCaseModel;
