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
                validate: {
                    validator: function(value: string) {
                        return value.length >= 5 && value.length <= 80;
                    },
                    message: (props: any) => `'${props.path}' should be between 5 and 80 characters, your input is ${props.value.length} characters long.` 
                },
                required: [true, "The 'Title' field is required"]
            },
            type: {
                type: String,
                enum: SECTION_TYPES,
                required: [true, "The 'Type' field is required"]
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
        return model<SectionDocument>(SECTION_MODEL, schema);
    }
}