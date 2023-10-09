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
                required: [true, "The 'Title' field is required"],
                validate: {
                    validator: function(value: string) {
                        return value.length >= 5 && value.length <= 80;
                    },
                    message: (props: any) => `'${props.path}' should be between 5 and 80 characters, your input is ${props.value.length} characters long.` 
                }
            },
            type: {
                type: String,
                enum: SECTION_TYPES,
                required: [true, "The 'Type' field is required"]
            },
            description: {
                type: String,
                required: [true, "The 'Description' field is required"],
                validate: {
                    validator: function(value: string) {
                        return value.length <= 500;
                    },
                    message: (props: any) => `'${props.path}' should no more than 500 characters, your input is ${props.value.length} characters long.` 
                }
            },
            content: {
                type: String,
                required: [true, "The 'Content' field is required"]
            },
            createdAt: {
                type: Number,
                immutable: true,
                default: Date.now
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
        
        return model<ArticleDocument>(ARTICLE_MODEL, schema);
    }
}