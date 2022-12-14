import mongoose from "../providers/Database";
import { SubmissionDocument } from "./submissions.model";
import { QuestionDocument } from "./question.model";
import { Date } from "mongoose";

export interface totalSubmission extends mongoose.Document {
  attempt: SubmissionDocument["_id"][];
  success: boolean;
  timestamp: Date;
}

export interface submit extends mongoose.Document {
  question: QuestionDocument["_id"];
  totalSubmissions: totalSubmission["attempt"];
}

export type IUserModel = mongoose.Document & {
  email: string;
  name: string;
  hash: string;
  wildCardCode: string;
  submits: submit["question" | "totalSubmissions"];
};

export const UserSchema = new mongoose.Schema<IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String
    },
    wildCardCode: {
      type: String,
      default: ' '
    },
    submits: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        totalSubmissions: [
          {
            attempt: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Submission",
              },
            ],
            success: { type: Boolean, default: false },
            timestamp: { type: Date, default: Date.now },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model<IUserModel>("User", UserSchema);

export default User;
