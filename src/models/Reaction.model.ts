import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { ARTICLE_MODEL } from "./Article.model";

export const REACTION_MODEL = "Reaction";
export const REACTION_TYPES = ["like", "dislike"];
export type TReaction = InferSchemaType<typeof ReactionModel.schema>;
export type ReactionDocument = Document<unknown, {}, TReaction> & TReaction;

export default class ReactionModel {
    static get schema() {
        return new Schema({
            type: {
                type: String,
                enum: REACTION_TYPES,
                required: [true, "The 'Type' field is required"]
            },
            user: {
                type: Types.ObjectId,
                ref: USER_MODEL
            },
            article: {
                type: Types.ObjectId,
                ref: ARTICLE_MODEL
            },
            reactedAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            }
        });
    }

    static create() {
        const schema = this.schema;
        return model<ReactionDocument>(REACTION_MODEL, schema);
    }
}