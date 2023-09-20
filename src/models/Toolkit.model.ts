import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { SECTION_MODEL } from "./Section.model";

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
                required: true
            },
            description: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 500
            },
            type: {
                type: String,
                enum: TOOLKIT_TYPES,
                required: true,
                default: TOOLKIT_TYPES[0]
            },
            createdBy: {
                type: Types.ObjectId,
                ref: USER_MODEL,
                required: true
            },
            sections: [{
                type: Types.ObjectId,
                ref: SECTION_MODEL
            }],
            createdAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            },
            company: {
                type: String,
                required: true
            }
        });
    }

    static create() {
        const schema = this.schema;
        return model(TOOLKIT_MODEL, schema);
    }
}