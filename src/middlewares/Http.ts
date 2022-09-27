import type { Application } from "express";
import session from "express-session";
import compression from "compression";
import helmet from "helmet";
import hpp from "hpp";
import MongoStore from "connect-mongo";
import Log from "./Log";
import bodyparser from "body-parser";

class Http {
  public static init(_app: Application): Application {
    Log.info("Initializing HTTP middleware");

    const secret = process.env.SESSION_SECRET || "secret";
    const sessionOptions = {
      resave: true,
      saveUninitialized: true,
      secret: secret,
      cookie: {
        maxAge: 1209600000, // Two weeks (in ms)
      },
    // samesite: "none",
    // secure: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
      }),
    };
    
    _app.use(hpp());
    _app.use(helmet());
    _app.use(bodyparser.json());
    _app.use(bodyparser.urlencoded({ extended: true }));

    _app.use(compression());

    return _app;
  }
}

export default Http;
