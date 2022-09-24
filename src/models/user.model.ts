import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import { SubmissionDocument } from "./submissions.model";
import { QuestionDocument } from "./question.model"; 

interface totalSubmission extends mongoose.Document {
  attempt: SubmissionDocument["_id"][];
}

interface submit extends mongoose.Document {
  question: QuestionDocument["_id"];
  totalSubmissions: totalSubmission["attempt"];
}
export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  wildCardCode: string;
  submits: submit["question" | "totalSubmissions"];
  comparePassword(candidatePassword: string): Promise<Boolean>;
}

const userSchema = new mongoose.Schema(
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
      type: String
    },
    submits: [{
        question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        totalSubmissions: [{
            attempt: [{
                type: mongoose.Schema.Types.ObjectId, ref: "Submission"
            }]
        }],
  }]
},
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  if (!user.isModified) {
    return next();
  }

  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;

  return next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
