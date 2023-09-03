import { Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { ARTICLE_MODEL } from "./Article.model";

export const REACTION_MODEL = "Reaction";
export const REACTION_TYPES = ["like", "dislike"];

export default class ReactionModel {
    static get schema() {
        return new Schema({
            type: {
                type: String,
                enum: REACTION_TYPES
            },
            user: {
                type: Types.ObjectId,
                ref: USER_MODEL
            },
            post: {
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
        return model(REACTION_MODEL, schema);
    }
}