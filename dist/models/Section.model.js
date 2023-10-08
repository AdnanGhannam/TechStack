"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECTION_TYPES = exports.SECTION_MODEL = void 0;
const mongoose_1 = require("mongoose");
const User_model_1 = require("./User.model");
const Article_model_1 = require("./Article.model");
const Toolkit_model_1 = require("./Toolkit.model");
exports.SECTION_MODEL = "Section";
exports.SECTION_TYPES = ["tutorial", "reference"];
class SectionModel {
    static get schema() {
        return new mongoose_1.Schema({
            title: {
                type: String,
                validate: {
                    validator: function (value) {
                        return value.length >= 5 && value.length <= 80;
                    },
                    message: (props) => `'${props.path}' should be between 5 and 80 characters, your input is ${props.value.length} characters long.`
                },
                required: [true, "The 'Title' field is required"]
            },
            type: {
                type: String,
                enum: exports.SECTION_TYPES,
                required: [true, "The 'Type' field is required"]
            },
            createdAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            },
            creator: {
                type: mongoose_1.Types.ObjectId,
                ref: User_model_1.USER_MODEL
            },
            toolkit: {
                type: mongoose_1.Types.ObjectId,
                ref: Toolkit_model_1.TOOLKIT_MODEL
            },
            articles: [{
                    type: mongoose_1.Types.ObjectId,
                    ref: Article_model_1.ARTICLE_MODEL
                }]
        });
    }
    static create() {
        const schema = this.schema;
        return (0, mongoose_1.model)(exports.SECTION_MODEL, schema);
    }
}
exports.default = SectionModel;
