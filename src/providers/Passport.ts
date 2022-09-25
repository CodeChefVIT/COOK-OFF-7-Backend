import { Application } from "express";
import passport from "passport";
import Log from "../middlewares/Log";
import User, { IUserModel } from "../models/user.model";
import LocalStrategy from "../services/strategies/Local";
class Passport {
  public static mount(_app: Application): Application {
    _app.use(passport.initialize());
    _app.use(passport.session());

    passport.serializeUser((user, done) => {
      const currentUser = user as IUserModel;
      done(null, currentUser.id);
    });
    passport.deserializeUser<any, any>((id, done) => {
      User.findById(id, (err: Error, user: IUserModel) => {
        done(err, user);
      });
    });
    LocalStrategy.init(passport);
    return _app;
  }
  public static isAuthenticated(req: any, res: any, next: any) {
    if (req.isAuthenticated()) return next();
    return res.status(403).json({
      success: false,
      error: "Not authenticated",
    });
  }
}

export default Passport;
