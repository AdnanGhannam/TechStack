import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { ARTICLE_MODEL } from "./Article.model";
import { TOOLKIT_MODEL } from "./Toolkit.model";

export const SECTION_MODEL = "Section";
export const SECTION_TYPES = ["tutorial", "reference"];
export type TSection = InferSchemaType<typeof SectionModel.schema>;
export type SectionDocument = Document<unknown, {}, TSection> & TSection;

export default class SectionModel {
    static get schema() {
        return new Schema({
            title: {
                type: String,
                minlength: 5,
                maxlength: 80,
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
            toolkit: {
                type: Types.ObjectId,
                ref: TOOLKIT_MODEL
            },
            articles: [{
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