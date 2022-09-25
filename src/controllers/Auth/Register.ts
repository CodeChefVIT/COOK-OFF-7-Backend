import User from "../../models/user.model";
import { Request, Response } from "express";
import Log from "../../middlewares/Log";
import SendEmail from "../../services/sendEmail";
class Register {
  public static async create(req: Request, res: Response) {
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser)
        return res.status(400).json({
          errors: [{ msg: "Account with that email address already exists." }],
        });

      const hash =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      // size of hash = 26
      const user = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        hash: hash,
      });
      await SendEmail.verify(
        user.email,
        `${req.get('host')}/verify/${user._id}/${hash}`
      );
      return res.status(200).json({
        success: true,
        message:
          "Account created successfully. Check your email for verification link.",
      });
    } catch (err) {
      Log.error(err);
      return res.status(500).json({
        success: false,
        error: "Server error",
      });
    }
  }
  public static async verify(req: Request, res: Response) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user)
        return res.status(400).json({ errors: [{ msg: "Invalid hash." }] });
      if (user.hash !== req.params.hash)
        return res.status(400).json({ errors: [{ msg: "Invalid hash." }] });
      user.hash = "";
      user.isVerified = true;
      await user.save();
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Server error",
          });
        }
        return res.status(200).json({
          success: true,
          message: "Account verified successfully",
        });
      });
    } catch (err) {
      Log.error(err);
      return res.status(500).json({
        success: false,
        error: "Server error",
      });
    }
  }
  public static async resendVerification(req: Request, res: Response) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user)
        return res.status(400).json({
          errors: [{ msg: "Account with that email address does not exist." }],
        });
      const newhash =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      user.hash = newhash;
      await user.save();
      await SendEmail.verify(
        user.email,
        `${req.get('host')}/verify/${user._id}/${newhash}`
      );
      return res.status(200).json({ user });
    } catch (err) {
      Log.error(err);
      return res.status(500).json({ errors: [{ msg: err.message }] });
    }
  }
}

export default Register;
