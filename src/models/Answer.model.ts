import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { VOTE_MODEL } from "./Vote.model";
import { QUESTION_MODEL } from "./Question.model";

export const ANSWER_MODEL = "Answer";
export type TAnswer = InferSchemaType<typeof AnswerModel.schema>;
export type AnswerDocument = Document<unknown, {}, TAnswer> & TAnswer;

export default class AnswerModel {
    static get schema() {
        return new Schema({
            question: {
                type: Types.ObjectId,
                ref: QUESTION_MODEL
            },
            user: {
                type: Types.ObjectId,
                ref: USER_MODEL
            },
            content: {
                type: String,
                required: true,
                minlength: 30
            },
            createdAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            },
            lastModifyAt: {
                type: Number
            },
            votes: [{
                type: Types.ObjectId,
                ref: VOTE_MODEL
            }],
            isCorrect: {
                type: Boolean,
                default: null
            }
        });
    }

    static create() {
        const schema = this.schema;
        return model(ANSWER_MODEL, schema);
    }
}
