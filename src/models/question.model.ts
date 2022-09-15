import mongoose from "mongoose";
import { TestCaseDocument } from "./testCases.model";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    testCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "TestCase" }],
    // ! Memory here or in testCases?
});

export interface QuestionDocument extends mongoose.Document {
    question: string;
    testCases: TestCaseDocument["_id"][];
}

const QuestionModel = mongoose.model<QuestionDocument>("Question", questionSchema);
export default QuestionModel;