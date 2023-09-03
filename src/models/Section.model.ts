import { Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { ARTICLE_MODEL } from "./Article.model";

export const SECTION_MODEL = "Section";
export const SECTION_TYPES = ["tutorial", "reference"];

export default class SectionModel {
    static get schema() {
        return new Schema({
            title: {
                type: String,
                unique: true,
                minlength: 5,
                maxlength: 40,
                required: true
            },
            type: {
                type: String,
                enum: SECTION_TYPES,
                required: true
            },
            createdAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            },
            creator: {
                type: Types.ObjectId,
                ref: USER_MODEL
            },
            children: [{
                type: Types.ObjectId,
                ref: ARTICLE_MODEL
            }]
        });
    }

    static create() {
        const schema = this.schema;
        return model(SECTION_MODEL, schema);
    }
}