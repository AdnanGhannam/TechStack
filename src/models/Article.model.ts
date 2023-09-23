import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { SECTION_MODEL, SECTION_TYPES } from "./Section.model";
import { REACTION_MODEL } from "./Reaction.model";
import { FEEDBACK_MODEL } from "./Feedback.model";
import { TOOLKIT_MODEL } from "./Toolkit.model";

export const ARTICLE_MODEL = "Article";
export type TArticle = InferSchemaType<typeof ArticleModel.schema>;
export type ArticleDocument = Document<unknown, {}, TArticle> & TArticle;

export default class ArticleModel {
    static get schema() {
        return new Schema({
            title: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 80
            },
            type: {
                type: String,
                enum: SECTION_TYPES,
                required: true
            },
            description: {
                type: String,
                required: true,
                maxlength: 300
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
            views: {
                type: Number,
                default: 0
            },
            toolkit: {
                type: Types.ObjectId,
                ref: TOOLKIT_MODEL
            },
            section: {
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
        schema.pre("save", function() {
            if (!this.lastUpdateFrom) {
                this.lastUpdateFrom = this.creators[0];
            }
        });

        return model(ARTICLE_MODEL, schema);
    }
}