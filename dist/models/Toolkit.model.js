"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOOLKIT_TYPES = exports.TOOLKIT_MODEL = void 0;
const mongoose_1 = require("mongoose");
const User_model_1 = require("./User.model");
const Section_model_1 = require("./Section.model");
const Question_model_1 = require("./Question.model");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
exports.TOOLKIT_MODEL = "Toolkit";
exports.TOOLKIT_TYPES = ["language", "library", "framework"];
class ToolkitModel {
    static get schema() {
        return new mongoose_1.Schema({
            name: {
                type: String,
                validate: {
                    validator: function (value) {
                        return value.length >= 1 && value.length <= 30;
                    },
                    message: (props) => `'${props.path}' should be between 1 and 30 characters, your input is ${props.value.length} characters long.`
                },
                required: [true, "The 'Name' field is required"],
                unique: true
            },
            description: {
                type: String,
                required: [true, "The 'Description' field is required"],
                validate: {
                    validator: function (value) {
                        return value.length >= 10 && value.length <= 500;
                    },
                    message: (props) => `'${props.path}' should be between 10 and 500 characters, your input is ${props.value.length} characters long.`
                }
            },
            type: {
                type: String,
                enum: exports.TOOLKIT_TYPES,
                required: [true, "The 'Type' field is required"],
                default: exports.TOOLKIT_TYPES[0]
            },
            creator: {
                type: mongoose_1.Types.ObjectId,
                ref: User_model_1.USER_MODEL,
                required: true
            },
            sections: [{
                    type: mongoose_1.Types.ObjectId,
                    ref: Section_model_1.SECTION_MODEL
                }],
            questions: [{
                    type: mongoose_1.Types.ObjectId,
                    ref: Question_model_1.QUESTION_MODEL
                }],
            createdAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            },
            company: {
                type: String,
                required: [true, "The 'Company' field is required"],
            }
        });
    }
    static create() {
        const schema = this.schema;
        schema.plugin(mongoose_unique_validator_1.default, { message: "'{PATH}' is aleady used" });
        return (0, mongoose_1.model)(exports.TOOLKIT_MODEL, schema);
    }
}
exports.default = ToolkitModel;
