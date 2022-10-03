import { Request, Response } from "express";
import QuestionModel from "../../models/question.model";
import UserModel from "../../models/user.model";
import TestCaseModel from "../../models/testCases.model";

class Question {
  public static async getAll(req: Request, res: Response) {
    try {
      const questions = await QuestionModel.find();
      for (let i = 0; i < questions.length; i++) {
        questions[i].testCases = [];
      }
      return res.status(200).json({ questions });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
  public static async getByID(req: Request, res: Response) {
    try {
      const question = await QuestionModel.findById(req.params.id).populate(
        "testCases",
        "input expectedOutput number hidden time memory wildCardCode redeemed"
      );
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      let count = 0;
      for (let i = 0; i < question.testCases.length; i++) {
        count++;
        if (question.testCases[i].hidden) {
          question.testCases[i] = null;
        }
        question.testCases[i].wildCardCode = "";
      }
      return res.status(200).json({
        question,
        testCaseCount: count,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }

  public static async createQuestion(req: Request, res: Response) {
    try {
      const ques = await TestCaseModel.create({
        question: req.body.question,
        inputFormat: req.body.inputFormat,
        outputformat: req.body.outputformat,
        constrains: req.body.constrains, //? Array To be input
        sampleTestInput: req.body.sampleTestInput,
        sampleTestOutput: req.body.sampleTestOutput,
        timeLimit: req.body.timeLimit,
        sourceLimit: req.body.sourceLimit,
      });
      return res.status(201).json(ques);
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
}

export default Question;
