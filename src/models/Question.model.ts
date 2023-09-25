import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { VOTE_MODEL } from "./Vote.model";

export const QUESTION_MODEL = "Question";
export type TQuestion = InferSchemaType<typeof QuestionModel.schema>;
export type QuestionDocument = Document<unknown, {}, TQuestion> & TQuestion;

export default class QuestionModel {
    static get schema() {
        return new Schema({
            title: {
                type: String,
                required: true,
                maxlength: 150
            },
            content: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            },
            lastModifyAt: {
                type: Number
            },
            views: {
                type: Number
            },
            user: {
                type: Types.ObjectId,
                ref: USER_MODEL
            },
            votes: [{
                type: Types.ObjectId,
                ref: VOTE_MODEL
            }],
            answers: [{
            }]
        });
    }

    static create() {
        const schema = this.schema;
        return model(QUESTION_MODEL, schema);
    }
}
