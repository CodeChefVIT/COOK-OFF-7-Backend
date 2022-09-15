import { Request, Response } from "express";
import { SendSubmissionInput } from "../schema/submissions.schema";
import QuestionModel from "../models/question.model";
import SubmissionModel from "../models/submissions.model";
import UserModel from "../models/user.model";
import { getSubmissionData, sendCode } from "../service/judege0.service";
import log from "../utils/logger";

export const sendSubmission = async (
    req: Request<{}, {}, SendSubmissionInput["body"]>,
    res: Response) => {
        // Get Question ID, code from user
        // get all test cases for the question
        // run the code against all test cases
        // save the result to the db 
        // To save in submissions model
        // To save in user model
        try {
            const { questionId, code, language } = req.body;
            const question = await QuestionModel.findById(questionId).populate("testCases");
            const user = await UserModel.findById(res.locals.user._id);
            if (!user) {
                log.error("User not found");
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
                const { input, expectedOutput } = testCase;
                const token = await sendCode(code, language, expectedOutput, input);
                const submission = await SubmissionModel.create({
                    code,
                    language,
                    question: questionId,
                    testCase: testCase._id,
                    user: res.locals.user._id,
                    token,
                });
                arrayOfSubmissions.push(submission._id);
                // ! TO DO: parse the data , and display it to the user
                const data = await getSubmissionData(token);

                arrayOfdata.push(data);
            }

            for(let i = 0; i < user.submits.length; i++) {
                if(user.submits[i].question.toString() === questionId) {
                    user.submits[i].totalSubmissions.push({
                        attempt: arrayOfSubmissions
                    });
                    break;
                } else {
                    return res.status(404).json({
                        message: "Question not found"
                    })
                }
            }
            await user.save();

            // TODO: call the judge0 service to verify cases
            return res.status(200).json({
                message: "Submitted Successfully",
                data: arrayOfdata
            });
        } catch (error: any) {
            log.error(error);
            return res.status(500).json({ error });
        }
}