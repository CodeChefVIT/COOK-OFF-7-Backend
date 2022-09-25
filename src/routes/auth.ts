import passport from "passport";
import { Router, Response, NextFunction } from "express";
import Login from "../controllers/Auth/Login";
import Register from "../controllers/Auth/Register";
import Validate from "../middlewares/Validate";
import Joi from "joi";
import Passport from "../providers/Passport";
const router = Router();

const schema = {
  signup: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirm: Joi.string().required().equal(Joi.ref("password")),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

router.post("/auth/login", Validate.body(schema.login), Login.login);
router.get("/auth/logout", Login.logout);

router.post("/auth/signup", Validate.body(schema.signup), Register.create);
router.get("/verify/:id/:hash", Register.verify);
router.post("/auth/resendEmail", Register.resendVerification);

router.get("/profile", Passport.isAuthenticated, Login.myProfile);

export default router;
