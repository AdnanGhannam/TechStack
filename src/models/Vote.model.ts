import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";

export const VOTE_MODEL = "Vote";
export type TVote = InferSchemaType<typeof VoteModel.schema>;
export type VoteDocument = Document<unknown, {}, TVote> & TVote;

export default class VoteModel {
    static get schema() {
        return new Schema({
            on: {
                type: Types.ObjectId
            },
            user: {
                type: Types.ObjectId,
                ref: USER_MODEL
            },
            value: {
                type: Number,
                required: [true, "'Value' is required"]
            },
            votedAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            }
        });
    }

    static create() {
        const schema = this.schema;
        return model<VoteDocument>(VOTE_MODEL, schema);
    }
}
