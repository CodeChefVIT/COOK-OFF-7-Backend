import { Request, Response } from "express";
import TestCaseModel from "../../models/testCases.model";

class TestCases {
  public static async createTestCases(req: Request, res: Response) {
    try {
      const testCase = await TestCaseModel.create({
        expectedOutput: req.body.expectedOutput,
        input: req.body.input,
        number: req.body.number,
        hidden: req.body.hidden,
        time: req.body.time,
        memory: req.body.memory,
        wildCardCode: req.body.wildCardCode,
        redeemed: req.body.redeemed,
        question: req.body.question,
      });
      return res.status(201).json(testCase);
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
}

export default TestCases;
