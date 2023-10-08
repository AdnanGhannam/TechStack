"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REACTION_TYPES = exports.REACTION_MODEL = void 0;
const mongoose_1 = require("mongoose");
const User_model_1 = require("./User.model");
const Article_model_1 = require("./Article.model");
exports.REACTION_MODEL = "Reaction";
exports.REACTION_TYPES = ["like", "dislike"];
class ReactionModel {
    static get schema() {
        return new mongoose_1.Schema({
            type: {
                type: String,
                enum: exports.REACTION_TYPES,
                required: [true, "The 'Type' field is required"]
            },
            user: {
                type: mongoose_1.Types.ObjectId,
                ref: User_model_1.USER_MODEL
            },
            article: {
                type: mongoose_1.Types.ObjectId,
                ref: Article_model_1.ARTICLE_MODEL
            },
            reactedAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            }
        });
    }
    static create() {
        const schema = this.schema;
        return (0, mongoose_1.model)(exports.REACTION_MODEL, schema);
    }
}
exports.default = ReactionModel;
