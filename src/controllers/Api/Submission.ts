import { Request, Response } from "express";
import { Long } from "mongodb";
import Log from "../../middlewares/Log";
import QuestionModel from "../../models/question.model";
import SubmissionModel from "../../models/submissions.model";
import UserModel, { IUserModel, totalSubmission } from "../../models/user.model";
import Judge0 from "../../services/judge0";
import { submit } from "../../models/user.model";



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
      const questionNumber = question.number;
      
      if (questionNumber > 2) {
        //  check if user has submitted the previous question and success is true
        const previousQuestionNumber = questionNumber - 1;
        const previous2QuestionNumber = questionNumber - 2;
        let question = await QuestionModel.findOne({
          number: previousQuestionNumber
        });
        let question2 = await QuestionModel.findOne({
          number: previous2QuestionNumber
        });
        if (!question || !question2) {
          return res.status(404).json({
            message: "Question not found",
          });
        }
        
        const Question1 = user.submits.filter(
          (submit: submit) => submit.question.toString() === question._id
        )
        const Question2 = user.submits.filter(
          (submit: submit) => submit.question.toString() === question2._id
        )
        // check if sucess is true
        if (Question1.length === 0 || Question2.length === 0) {
          return res.status(400).json({
            message: "Please complete previous questions",
          });
        }
        const Question1True = Question1.filter(
          (totalSubmission: totalSubmission) => totalSubmission.success === true
        );
        // check if success in total submission
        const success1 = Question1True.filter(
          (submit: totalSubmission) => submit.success === true
        );
        const success2 = Question2.filter(
          (submit: totalSubmission) => submit.success === true
        );
        if (!success2 || !success1) {
          return res.status(404).json({
            message: "You have not solved this question",
          });
        }
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
        console.log(token);
        let dataFromAPI = await Judge0.getSubmissionData(token);
        console.log(dataFromAPI);
        let pass = false;
        let temp: boolean = false;
        while (!temp) {
          dataFromAPI = await Judge0.getSubmissionData(token);
          if (dataFromAPI.status.id !== 1 || dataFromAPI.status.id !== 2) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            temp = true;
          }
        }

        if (dataFromAPI.status.id === 3) {
          pass = true;
        }

        const submission = {
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
        };
        const submission2 = await SubmissionModel.create(submission);
        arrayOfSubmissions.push(submission2._id);
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
          user.submits.push({
            question: question._id,
            totalSubmissions: [
              {
                attempt: arrayOfSubmissions,
              },
            ],
          });
          break;
        }
      }
      await user.save();
      for (let i = 0; i < arrayOfdata.length; i++) {
        console.log(arrayOfdata[i]);
        console.log(i)
        if (arrayOfdata[i].hidden) {
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
  public static async getLeaderboard(req: Request, res: Response) {
    try {
      // get users.submits.totalSubmissions.attempt and questsions as well
      const users = await UserModel.find().populate('submits.question');
      const leaderboard = [];
      // check who has the most success
      for (let i = 0; i < users.length; i++) {
        // users.submits.totalSubmissions.success
        // loop through the submits.totalSubmissions
        // filter the one with success
        // filter the one that has the lowest timestamp 
        for (let j = 0; j < users[i].submits.length; j++) {
          const success = users[i].submits[j].totalSubmissions.filter(
            (totalSubmission: totalSubmission) => totalSubmission.success === true
          );
          for (let k = 0; k < success.length; k++) {
            // filter with the oldest date success: totalSubmission, success.timestamp
            const oldest = success.filter(
              (totalSubmission: totalSubmission) =>
                totalSubmission.timestamp ===
                Math.min.apply(
                  Math,
                  success.map(function (totalSubmission: totalSubmission) {
                    return totalSubmission.timestamp;
                  }
                )
              )
            );
            leaderboard.push({
              user: users[i],
              question: {
                number: users[i].submits[j].question.number,
                title: users[i].submits[j].question.title,
                success: oldest,
              }
            });
          } 
        }
      }
      // within this leaderboard
      // sort by the oldest timestamp and the question number
      leaderboard.sort((a, b) => {
        if (a.question.number > b.question.number) {
          return 1;
        } else if (a.question.number < b.question.number) {
          return -1;
        } else {
          if (a.question.success.timestamp > b.question.success.timestamp) {
            return 1;
          } else if (a.question.success.timestamp < b.question.success.timestamp) {
            return -1;
          } else {
            return 0;
          }
        }
      });
      // with the most number of question success is at top
      // if the number of question is same
      // compare using timestamp
      const newLeaderboard = [];
      for (let i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i].question.success.length > 0) {
          newLeaderboard.push(leaderboard[i]);
        }
      } 
      newLeaderboard.sort((a, b) => {
        if (a.question.success.length > b.question.success.length) {
          return -1;
        } else if (a.question.success.length < b.question.success.length) {
          return 1;
        } else {
          if (a.question.success.timestamp > b.question.success.timestamp) {
            return 1;
          } else if (a.question.success.timestamp < b.question.success.timestamp) {
            return -1;
          } else {
            return 0;
          }
        }
      });
      return res.status(200).json({
        message: "Leaderboard",
        leaderboard: leaderboard,
        newLeaderboard: newLeaderboard
      });
      } catch (err) {
      Log.error(err);
      return res.status(500).json({ err });
    }
  } 
}

export default submission;
