import mongoose from "../providers/Database";
import bcryptjs from "bcryptjs";

export type IUserModel = mongoose.Document & {
  email: string;
  name: string;
  password: string;
  hash: string;
  isVerified: boolean;
  comparePassword: (password: string) => Promise<boolean>;
};

export const UserSchema = new mongoose.Schema<IUserModel>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  hash: { type: String },
  isVerified: { type: Boolean, default: false },
});

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
