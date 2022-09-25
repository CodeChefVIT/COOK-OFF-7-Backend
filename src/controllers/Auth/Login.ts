import passport from "passport";
import { NextFunction, Request, Response } from "express";
import Log from "../../middlewares/Log";
import User, { IUserModel } from "../../models/user.model";

class Login {
  public static async login(req: Request, res: Response, next: NextFunction) {
    // use passport
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        Log.error(err);
        return res.status(500).json({
          success: false,
          error: "Server error",
        });
      }
      if (!user) {
        return res.status(400).json({
          success: false,
          info,
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          Log.error(err);
          return res.status(500).json({
            success: false,
            error: "Server error",
          });
        }
        res.status(200).json({
          success: true,
          message: "Logged in successfully",
        });
      });
    })(req, res, next);
  }

  public static async logout(req: Request, res: Response) {
    await req.logOut;
    req.session.destroy((err) => {
      if (err)
        return res.status(500).json({
          success: false,
          error: "Failed to destroy session",
        });
      req.user = null;
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    });
  }

  public static async myProfile(req: Request, res: Response) {
    try {
      const currentUser = req.user as IUserModel;
      const user = await User.findById(currentUser.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      Log.error(err);
      return res.status(500).json({
        success: false,
        message: "internal error",
      });
    }
  }
}

export default Login;
