import { Request, Response } from "express";
import QuestionModel from "../models/question.model";
import UserModel from "../models/user.model";
import TestCaseModel from "../models/testCases.model";

export const getQuestions = async (req: Request, res: Response) => {
    try {
        const questions = await QuestionModel.find();
        for (let i = 0; i < questions.length; i++) {
            questions[i].testCases = [];
        }
        return res.status(200).json({
            questions: questions,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
}

export const getQuestion = async (req: Request, res: Response) => {
    try {
        
        const question = await QuestionModel.findById(req.params.id).populate("testCases");
        // see what to show in the question for frontend
        if (!question) {
            return res.status(404).json({
                message: "Question not found",
            });
        }
        // check if user has wildcard code
        const user = await UserModel.findById(res.locals.user._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        
        // check if user has wildcardcode
        // if he does, dont hide that particular test case
        // if he doesnt, hide the test case
        // if he has wildcard code, check if he has redeemed it
        // !
        // Here, ask Senior devs what to do
        return res.status(200).json({
            message: "Question found"
        });

    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
}