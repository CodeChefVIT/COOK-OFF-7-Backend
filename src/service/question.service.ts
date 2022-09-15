import QuestionModel from "../models/question.model";

export async function getQuestionById(id: string) {
    try {
        const question = await QuestionModel.findById(id).populate("testCases", '_id input expectedOutput hidden');
        // loop through test cases and remove hidden ones
        if (question?.testCases)  {
            question.testCases = question.testCases.filter(testCase => !testCase.hidden);
        }     
        return question;
    } catch (e: any) {
        throw new Error(e);
    }
}

export async function getQuestionTitles() {
    try {
        const questions = await QuestionModel.find({}, '_id title');
        return questions;
    } catch (e: any) {
        throw new Error(e);
    }
}

export async function getQuestionTitlesByDifficulty(difficulty: string) {
    try {
        const questions = await QuestionModel.find({ difficulty }, '_id title');
        return questions;
    } catch (e: any) {
        throw new Error(e);
    }
}