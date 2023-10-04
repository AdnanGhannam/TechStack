import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { SECTION_MODEL } from "./Section.model";
import { QUESTION_MODEL } from "./Question.model";

export const TOOLKIT_MODEL = "Toolkit";
export const TOOLKIT_TYPES = ["language", "library", "framework"];
export type TToolkit = InferSchemaType<typeof ToolkitModel.schema>;
export type ToolkitDocument = Document<unknown, {}, TToolkit> & TToolkit;

export default class ToolkitModel {
    static get schema() {
        return new Schema({
            name: {
                type: String,
                minlength: 1,
                maxlength: 30,
                required: [true, "'Name' is required"],
                unique: true
            },
            description: {
                type: String,
                required: [true, "'Description' is required"],
                minlength: 3,
                maxlength: 500
            },
            type: {
                type: String,
                enum: TOOLKIT_TYPES,
                required: [true, "'Type' is required"],
                default: TOOLKIT_TYPES[0]
            },
            creator: {
                type: Types.ObjectId,
                ref: USER_MODEL,
                required: true
            },
            sections: [{
                type: Types.ObjectId,
                ref: SECTION_MODEL
            }],
            questions: [{
                type: Types.ObjectId,
                ref: QUESTION_MODEL
            }],
            createdAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            },
            company: {
                type: String,
                required: [true, "'Company' is required"],
            }
        });
    }

    static create() {
        const schema = this.schema;
        return model(TOOLKIT_MODEL, schema);
    }
}