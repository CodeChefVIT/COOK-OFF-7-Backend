import { number, object, string, TypeOf } from "zod";


export const sendSubmission = object({
    body: object({
        questionId: string({
            required_error: "Question ID is required",
        }),
        code: string({
            required_error: "Code is required",
        }),
        language: number({
            required_error: "Language is required",
        })
    }),
})

export type SendSubmissionInput = TypeOf<typeof sendSubmission>