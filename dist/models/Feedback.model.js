"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEEDBACK_MODEL = void 0;
const mongoose_1 = require("mongoose");
const User_model_1 = require("./User.model");
const Article_model_1 = require("./Article.model");
exports.FEEDBACK_MODEL = "Feedback";
class FeedbackModel {
    static get schema() {
        return new mongoose_1.Schema({
            user: {
                type: mongoose_1.Types.ObjectId,
                ref: User_model_1.USER_MODEL
            },
            article: {
                type: mongoose_1.Types.ObjectId,
                ref: Article_model_1.ARTICLE_MODEL
            },
            text: {
                type: String,
                required: [true, "The 'Text' field is required"],
                validate: {
                    validator: function (value) {
                        return value.length <= 500;
                    },
                    message: (props) => `'${props.path}' should no more than 500 characters, your input is ${props.value.length} characters long.`
                }
            },
            sentAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            }
        });
    }
    static create() {
        const schema = this.schema;
        return (0, mongoose_1.model)(exports.FEEDBACK_MODEL, schema);
    }
}
exports.default = FeedbackModel;
