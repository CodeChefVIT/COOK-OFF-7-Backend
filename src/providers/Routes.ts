import type { Application } from "express";
import Log from "../middlewares/Log";
import AuthRouter from "../routes/auth";
class Routes {
  public mount(_app: Application): Application {
    Log.info("Initializing routes");
    _app.use("/", AuthRouter);
    return _app;
  }
}

export default new Routes();
