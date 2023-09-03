import { InferSchemaType, Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { ARTICLE_MODEL } from "./Article.model";

export const FEEDBACK_MODEL = "Feedback";
export type TFeedback = InferSchemaType<typeof FeedbackModel.schema>;

export default class FeedbackModel {
    static get schema() {
        return new Schema({
            user: {
                type: Types.ObjectId,
                ref: USER_MODEL
            },
            post: {
                type: Types.ObjectId,
                ref: ARTICLE_MODEL
            },
            text: {
                type: String,
                required: true,
                maxlength: 100
            },
            sentAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            }
        });
    }

    static create() {
        const schema = this.schema;
        return model(FEEDBACK_MODEL, schema);
    }
}