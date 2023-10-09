"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUESTION_MODEL = void 0;
const mongoose_1 = require("mongoose");
const User_model_1 = require("./User.model");
const Vote_model_1 = require("./Vote.model");
const Answer_model_1 = require("./Answer.model");
const Toolkit_model_1 = require("./Toolkit.model");
exports.QUESTION_MODEL = "Question";
class QuestionModel {
    static get schema() {
        return new mongoose_1.Schema({
            title: {
                type: String,
                required: [true, "The 'Title' field is required"],
                validate: {
                    validator: function (value) {
                        return value.length >= 10 && value.length <= 150;
                    },
                    message: (props) => `'${props.path}' should be between 10 and 150 characters, your input is ${props.value.length} characters long.`
                }
            },
            content: {
                type: String,
                required: [true, "'Content' is required"]
            },
            createdAt: {
                type: Number,
                immutable: true,
                default: Date.now
            },
            lastModifyAt: {
                type: Number,
                default: Date.now
            },
            views: {
                type: Number,
                default: 0
            },
            user: {
                type: mongoose_1.Types.ObjectId,
                ref: User_model_1.USER_MODEL
            },
            votes: [{
                    type: mongoose_1.Types.ObjectId,
                    ref: Vote_model_1.VOTE_MODEL
                }],
            toolkit: {
                type: mongoose_1.Types.ObjectId,
                ref: Toolkit_model_1.TOOLKIT_MODEL
            },
            answers: [{
                    type: mongoose_1.Types.ObjectId,
                    ref: Answer_model_1.ANSWER_MODEL
                }],
            isOpen: {
                type: Boolean,
                default: true
            }
        });
    }
    static create() {
        const schema = this.schema;
        return (0, mongoose_1.model)(exports.QUESTION_MODEL, schema);
    }
}
exports.default = QuestionModel;
