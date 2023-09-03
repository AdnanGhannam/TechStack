import { Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { SECTION_MODEL, SECTION_TYPES } from "./Section.model";
import { REACTION_MODEL } from "./Reaction.model";
import { FEEDBACK_MODEL } from "./Feedback.model";

export const ARTICLE_MODEL = "Article";

export default class ArticleModel {
    static get schema() {
        return new Schema({
            title: {
                type: String,
                required: true,
                unique: true,
                minlength: 5,
                maxlength: 40
            },
            type: {
                type: String,
                enum: SECTION_TYPES,
                required: true
            },
            description: {
                type: String,
                required: true,
                maxlength: 60
            },
            content: {
                type: String,
                required: true
            },
            createdAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            },
            creators: [{
                type: Types.ObjectId,
                ref: USER_MODEL,
                required: true
            }],
            lastUpdateFrom: {
                type: Types.ObjectId,
                ref: USER_MODEL
            },
            group: {
                type: Types.ObjectId,
                ref: SECTION_MODEL
            },
            reactions: [{
                type: Types.ObjectId,
                ref: REACTION_MODEL
            }],
            feedbacks: [{
                type: Types.ObjectId,
                ref: FEEDBACK_MODEL
            }]
        });
    }

    static create() {
        const schema = this.schema;
        return model(ARTICLE_MODEL, schema);
    }
}