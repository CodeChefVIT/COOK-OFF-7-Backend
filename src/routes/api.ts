import { Router } from "express";
import Joi from "joi";
import Passport from "../providers/Passport";
import Question from "../controllers/Api/Question";
import Submission from "../controllers/Api/Submission";
import Validate from "../middlewares/Validate";

const router = Router();

const schema = {
  id: Joi.object({
    id: Joi.string().required(),
  }),
  submit: Joi.object({
    questionId: Joi.string().required(),
    code: Joi.string().required(),
    language: Joi.string().required(),
  }),
};

router.get("/questions", Passport.isAuthenticated, Question.getAll);
router.get(
  "/questions/:id",
  Passport.isAuthenticated,
  Validate.params(schema.id),
  Question.getByID
);

router.post(
  "/submit",
  Passport.isAuthenticated,
  Validate.body(schema.submit),
  Submission.create
);

export default router;
