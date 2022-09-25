import { Strategy } from "passport-local";
import User from "../../models/user.model";
import Log from "../../middlewares/Log";

class Local {
  public static init(_passport: any): any {
    _passport.use(
      new Strategy(
        { usernameField: "email" },
        async (email: string, password: string, done) => {
          Log.info(`Email is ${email}`);
          Log.info(`Password is ${password}`);
          try {
            const user = await User.findOne({ email });
            if (!user) {
              return done(null, false, { message: "Incorrect email." });
            }
            if (!user.isVerified) {
              return done(null, false, { message: "Email not verified." });
            }
            const validate = await user.comparePassword(password);
            if (!validate) {
              return done(null, false, { message: "Incorrect password." });
            }
            return done(null, user, { message: "Logged In Successfully" });
          } catch (error) {
            done(error);
          }
        }
      )
    );
  }
}

export default Local;
