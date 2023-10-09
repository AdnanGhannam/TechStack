"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANSWER_MODEL = void 0;
const mongoose_1 = require("mongoose");
const User_model_1 = require("./User.model");
const Vote_model_1 = require("./Vote.model");
const Question_model_1 = require("./Question.model");
exports.ANSWER_MODEL = "Answer";
class AnswerModel {
    static get schema() {
        return new mongoose_1.Schema({
            question: {
                type: mongoose_1.Types.ObjectId,
                ref: Question_model_1.QUESTION_MODEL
            },
            user: {
                type: mongoose_1.Types.ObjectId,
                ref: User_model_1.USER_MODEL
            },
            content: {
                type: String,
                required: [true, "The 'Content' field is required"],
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
            votes: [{
                    type: mongoose_1.Types.ObjectId,
                    ref: Vote_model_1.VOTE_MODEL
                }],
            isCorrect: {
                type: Boolean,
                default: null
            }
        });
    }
    static create() {
        const schema = this.schema;
        return (0, mongoose_1.model)(exports.ANSWER_MODEL, schema);
    }
}
exports.default = AnswerModel;
