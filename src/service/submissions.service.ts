import { DocumentDefinition, FilterQuery } from "mongoose";
import SubmissionModel, { SubmissionDocument } from "../models/submissions.model";
import { Omit } from "lodash";

export async function createSubmission( 
    input: DocumentDefinition<Omit<SubmissionDocument, "pass" | "createdAt" | "updatedAt">>
) {
    try {
        const submission = await SubmissionModel.create(input);
        return submission;
    } catch (e: any) {
        throw new Error(e);
    }
}

export async function findSubmission(query: FilterQuery<SubmissionDocument>) {
    try {
        const submission = await SubmissionModel.findOne(query).lean();
        return submission;
    } catch (e: any) {
        throw new Error(e);
    }
}
