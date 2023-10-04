import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { USER_MODEL } from "./User.model";
import { SECTION_MODEL } from "./Section.model";
import { QUESTION_MODEL } from "./Question.model";
import uniqueValidator from "mongoose-unique-validator";

export const TOOLKIT_MODEL = "Toolkit";
export const TOOLKIT_TYPES = ["language", "library", "framework"];
export type TToolkit = InferSchemaType<typeof ToolkitModel.schema>;
export type ToolkitDocument = Document<unknown, {}, TToolkit> & TToolkit;

export default class ToolkitModel {
    static get schema() {
        return new Schema({
            name: {
                type: String,
                validate: {
                    validator: function(value: string) {
                        return value.length >= 1 && value.length <= 30;
                    },
                    message: (props: any) => `'${props.path}' should be between 1 and 30 characters, your input is ${props.value.length} characters long.` 
                },
                required: [true, "'Name' is required"],
                unique: true
            },
            description: {
                type: String,
                required: [true, "'Description' is required"],
                validate: {
                    validator: function(value: string) {
                        return value.length >= 10 && value.length <= 500;
                    },
                    message: (props: any) => `'${props.path}' should be between 10 and 500 characters, your input is ${props.value.length} characters long.` 
                }
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

        schema.plugin(uniqueValidator, { message: "'{PATH}' is aleady used" });

        return model<ToolkitDocument>(TOOLKIT_MODEL, schema);
    }
}