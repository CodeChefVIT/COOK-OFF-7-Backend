import { Request, Response } from "express";
import { Long } from "mongodb";
import Log from "../../middlewares/Log";
import QuestionModel from "../../models/question.model";
import SubmissionModel from "../../models/submissions.model";
import UserModel, { IUserModel } from "../../models/user.model";
import Judge0 from "../../services/judge0";

class submission {
  public static async create(req: Request, res: Response) {
    try {
      const { questionId, code, language } = req.body;
      const question = await QuestionModel.findById(questionId).populate(
        "testCases"
      );
      const currentUser = req.user as IUserModel;
      const user = await UserModel.findById(currentUser._id);
      if (!user) {
        Log.error("User not found");
        return res.status(404).json({ message: "User not found" });
      }
      if (!question) {
        return res.status(404).json({
          message: "Question not found",
        });
      }
      const arrayOfdata = [];
      const arrayOfSubmissions = [];
      for (let i = 0; i < question.testCases.length; i++) {
        const testCase = question.testCases[i];
        const { input, expectedOutput, memory, time } = testCase;
        const token = await Judge0.sendCode(
          code,
          language,
          expectedOutput,
          input,
          time,
          memory
        );
        let dataFromAPI = await Judge0.getSubmissionData(token);
        let pass = false;
        let temp: boolean = false;
        while (!temp) {
          dataFromAPI = await Judge0.getSubmissionData(token);
          if (dataFromAPI.status.id === 1 || dataFromAPI.status.id === 2) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            temp = true;
          }
        }

        if (dataFromAPI.status.id === 3) {
          pass = true;
        }

        const submission = await SubmissionModel.create({
          code: code,
          language: language,
          question: questionId,
          testCase: testCase._id,
          user: user._id,
          stderr: dataFromAPI.stderr,
          stdout: dataFromAPI.stdout,
          compile_output: dataFromAPI.compile_output,
          token: token,
          description: dataFromAPI.status.description,
          pass: pass,
        });
        arrayOfSubmissions.push(submission._id);
        arrayOfdata.push({
          testCaseNumber: [i + 1],
          testCaseID: testCase._id,
          pass: pass,
          hidden: testCase.hidden,
          submissionData: submission,
        });
      }

      for (let i = 0; i < user.submits.length; i++) {
        if (user.submits[i].question.toString() === questionId) {
          user.submits[i].totalSubmissions.push({
            attempt: arrayOfSubmissions,
          });
          break;
        } else {
          return res.status(404).json({
            message: "Question not found",
          });
        }
      }
      await user.save();
      for (let i = 0; i <= arrayOfdata.length; i++) {
        if (arrayOfdata[i].hidden === true) {
          arrayOfdata[i].submissionData = null;
        }
      }
      return res.status(200).json({
        message: "Submitted Successfully",
        tests: arrayOfdata,
        totalTests: question.testCases.length,
      });
    } catch (error: any) {
      Log.error(error);
      return res.status(500).json({ error });
    }
  }
}

export default submission;
