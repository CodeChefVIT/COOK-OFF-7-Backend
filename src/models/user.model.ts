import mongoose from "../providers/Database";
import bcryptjs from "bcryptjs";
import { SubmissionDocument } from "./submissions.model";
import { QuestionDocument } from "./question.model";

interface totalSubmission extends mongoose.Document {
  attempt: SubmissionDocument["_id"][];
}

interface submit extends mongoose.Document {
  question: QuestionDocument["_id"];
  totalSubmissions: totalSubmission["attempt"];
}

export type IUserModel = mongoose.Document & {
  email: string;
  name: string;
  password: string;
  hash: string;
  isVerified: boolean;

  wildCardCode: string;
  submits: submit["question" | "totalSubmissions"];

  comparePassword: (password: string) => Promise<boolean>;
};

export const UserSchema = new mongoose.Schema<IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    wildCardCode: {
      type: String,
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
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUserModel>("save", async function (next) {
  const user = this as IUserModel;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as IUserModel;
  const isMatch = await bcryptjs.compare(candidatePassword, user.password);
  return isMatch;
};

const User = mongoose.model<IUserModel>("User", UserSchema);

export default User;
