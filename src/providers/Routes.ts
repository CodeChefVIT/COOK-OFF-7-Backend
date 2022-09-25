import type { Application } from "express";
import Log from "../middlewares/Log";
import AuthRouter from "../routes/auth";
import ApiRouter from "../routes/api";
class Routes {
  public mount(_app: Application): Application {
    Log.info("Initializing routes");
    _app.use("/", AuthRouter);
    _app.use("/api/", ApiRouter);
    return _app;
  }
}

export default new Routes();
