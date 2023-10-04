import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { ARTICLE_MODEL } from "./Article.model";

export const FEEDBACK_MODEL = "Feedback";
export type TFeedback = InferSchemaType<typeof FeedbackModel.schema>;
export type FeedbackDocument = Document<unknown, {}, TFeedback> & TFeedback;

export default class FeedbackModel {
    static get schema() {
        return new Schema({
            user: {
                type: Types.ObjectId,
                ref: USER_MODEL
            },
            article: {
                type: Types.ObjectId,
                ref: ARTICLE_MODEL
            },
            text: {
                type: String,
                required: [true, "'Text' is required"],
                validate: {
                    validator: function(value: string) {
                        return value.length <= 300;
                    },
                    message: (props: any) => `'${props.path}' should no more than 300 characters, your input is ${props.value.length} characters long.` 
                }
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