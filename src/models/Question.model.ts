import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { VOTE_MODEL } from "./Vote.model";
import { ANSWER_MODEL } from "./Answer.model";
import { TOOLKIT_MODEL } from "./Toolkit.model";

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
                type: Number,
                default: 0
            },
            user: {
                type: Types.ObjectId,
                ref: USER_MODEL
            },
            votes: [{
                type: Types.ObjectId,
                ref: VOTE_MODEL
            }],
            toolkit: {
                type: Types.ObjectId,
                ref: TOOLKIT_MODEL
            },
            answers: [{
                type: Types.ObjectId,
                ref: ANSWER_MODEL
            }],
            isOpen: {
                type: Boolean,
                default: true
            }
        });
    }

    static create() {
        const schema = this.schema;
        return model(QUESTION_MODEL, schema);
    }
}
