"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VOTE_MODEL = void 0;
const mongoose_1 = require("mongoose");
const User_model_1 = require("./User.model");
exports.VOTE_MODEL = "Vote";
class VoteModel {
    static get schema() {
        return new mongoose_1.Schema({
            on: {
                type: mongoose_1.Types.ObjectId
            },
            user: {
                type: mongoose_1.Types.ObjectId,
                ref: User_model_1.USER_MODEL
            },
            value: {
                type: Number,
                required: [true, "The 'Value' field is required"]
            },
            votedAt: {
                type: Number,
                immutable: true,
                default: Date.now
            }
        });
    }
    static create() {
        const schema = this.schema;
        return (0, mongoose_1.model)(exports.VOTE_MODEL, schema);
    }
}
exports.default = VoteModel;
