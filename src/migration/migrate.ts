import QuestionModel from "../models/question.model";
import TestCaseModel from "../models/testCases.model";
import mongoose from "mongoose";
import { join } from 'path';
import fs from "fs"

interface TestCase {
    expectedOutput: string;
    input: string;
    number: number;
    time: number;
    memory: number;
    explanation?: string;
    hidden?: boolean;
    wildCardCode?: string;
}

interface Question {
    question: string;
    number: number;
    inputFormat: Array<string>;
    outputFormat: Array<string>;
    constraints: Array<string>;
    testCases: TestCase[];
}

const send = async () => {
    const jsonpath = await join(__dirname, '..', '..', 'assets', 'questions.json');
    const json = await fs.readFileSync(jsonpath, 'utf-8');
    const data: Question = JSON.parse(json);
    // question.testcase.length
    let testcases = [];
    for (let i=0; i < data.testCases.length; i++){
        const testCase = data.testCases[i];
        console.log(testCase);
        const { input, expectedOutput, number, memory, time } = testCase;
        const newTestCase = new TestCaseModel({
            input,
            number,
            expectedOutput,
            memory,
            time,
        })
        if (testCase.explanation) newTestCase.explanation = testCase.explanation;
        if (testCase.hidden) newTestCase.hidden = testCase.hidden;
        if (testCase.wildCardCode) newTestCase.wildCardCode = testCase.wildCardCode;
        await newTestCase.save();
        testcases.push(newTestCase._id);
    }
    const { question, number, inputFormat, outputFormat, constraints } = data;
    console.log(data);
    const newQuestion = new QuestionModel({
        question,
        number,
        inputFormat,
        outputFormat,
        constraints,
        testCases: testcases
    })
    await newQuestion.save();
}

(async() => {
    await mongoose.connect('mongodb://localhost:27017/cookoff3');
    await send();
})();