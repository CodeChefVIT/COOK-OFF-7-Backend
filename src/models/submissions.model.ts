import mongoose from "mongoose";
import { QuestionDocument } from "./question.model";
import { TestCaseDocument } from "./testCases.model";
import { UserDocument } from "./user.model";

const submissionSchema = new mongoose.Schema({
    code: { type: String, required: true },
    language: { type: Number, required: true },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    testCase: { type: mongoose.Schema.Types.ObjectId, ref: "TestCase" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    token: { type: String, required: true },
    pass: { type: Boolean, default: false },
}, { timestamps: true });

export interface SubmissionDocument extends mongoose.Document {
    code: string;
    language: number;
    question: QuestionDocument["_id"];
    testCase: TestCaseDocument["_id"];
    user: UserDocument["_id"];
    pass: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SubmissionModel = mongoose.model<SubmissionDocument>("Submission", submissionSchema);
export default SubmissionModel;