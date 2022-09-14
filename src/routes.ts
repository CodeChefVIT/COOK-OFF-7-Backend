import { Express, Request, Response } from "express";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionsHandler,
} from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";

const routes = (app: Express) => {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post(
    "/api/v1/users",
    validateResource(createUserSchema),
    createUserHandler
  );

  app.post(
    "/api/v1/sessions",
    validateResource(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/v1/sessions", requireUser, getUserSessionsHandler);

  app.delete("/api/v1/sessions", requireUser, deleteSessionHandler);
};

export default routes;
