import User from "../../models/user.model";
import { Request, Response } from "express";
import Log from "../../middlewares/Log";

class Register {
  public static async create(req: Request, res: Response) {
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser)
        return res.status(400).json({
          errors: [{ msg: "Account with that email address already exists." }],
        });
      const user = await User.create({
        email: req.body.email,
      });
      
      return res.status(200).json({
        success: true,
        message:
          "Account created successfully",
      });
    } catch (err) {
      Log.error(err);
      return res.status(500).json({
        success: false,
        error: "Server error",
      });
    }
  }
}

export default Register;
