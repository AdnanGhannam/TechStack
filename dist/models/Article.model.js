"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARTICLE_MODEL = void 0;
const mongoose_1 = require("mongoose");
const User_model_1 = require("./User.model");
const Section_model_1 = require("./Section.model");
const Reaction_model_1 = require("./Reaction.model");
const Feedback_model_1 = require("./Feedback.model");
const Toolkit_model_1 = require("./Toolkit.model");
exports.ARTICLE_MODEL = "Article";
class ArticleModel {
    static get schema() {
        return new mongoose_1.Schema({
            title: {
                type: String,
                required: [true, "The 'Title' field is required"],
                validate: {
                    validator: function (value) {
                        return value.length >= 5 && value.length <= 80;
                    },
                    message: (props) => `'${props.path}' should be between 5 and 80 characters, your input is ${props.value.length} characters long.`
                }
            },
            type: {
                type: String,
                enum: Section_model_1.SECTION_TYPES,
                required: [true, "The 'Type' field is required"]
            },
            description: {
                type: String,
                required: [true, "The 'Description' field is required"],
                validate: {
                    validator: function (value) {
                        return value.length <= 500;
                    },
                    message: (props) => `'${props.path}' should no more than 500 characters, your input is ${props.value.length} characters long.`
                }
            },
            content: {
                type: String,
                required: [true, "The 'Content' field is required"]
            },
            createdAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            },
            creators: [{
                    type: mongoose_1.Types.ObjectId,
                    ref: User_model_1.USER_MODEL,
                    required: true
                }],
            lastUpdateFrom: {
                type: mongoose_1.Types.ObjectId,
                ref: User_model_1.USER_MODEL
            },
            views: {
                type: Number,
                default: 0
            },
            toolkit: {
                type: mongoose_1.Types.ObjectId,
                ref: Toolkit_model_1.TOOLKIT_MODEL
            },
            section: {
                type: mongoose_1.Types.ObjectId,
                ref: Section_model_1.SECTION_MODEL
            },
            reactions: [{
                    type: mongoose_1.Types.ObjectId,
                    ref: Reaction_model_1.REACTION_MODEL
                }],
            feedbacks: [{
                    type: mongoose_1.Types.ObjectId,
                    ref: Feedback_model_1.FEEDBACK_MODEL
                }]
        });
    }
    static create() {
        const schema = this.schema;
        schema.pre("save", function () {
            if (!this.lastUpdateFrom) {
                this.lastUpdateFrom = this.creators[0];
            }
        });
        return (0, mongoose_1.model)(exports.ARTICLE_MODEL, schema);
    }
}
exports.default = ArticleModel;
