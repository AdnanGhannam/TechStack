import { Schema, Types, model } from "mongoose";
import { COLLECTION_MODEL } from "./Collection.model";

export const USER_MODEL = "User";
export const PRIVILEGES = ["user", "administrator"];

export default class UserModel {
    static get schema() {
        return new Schema({
            name: {
                type: String,
                required: true,
                unique: true,
                minlength: 4,
                maxlength: 20
            },
            email: {
                type: String,
                required: true,
                match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                unique: true
            },
            password: {
                type: String,
                required: true
            },
            privilege: {
                type: String,
                enum: PRIVILEGES,
                default: PRIVILEGES[0]
            },
            joinedAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            },
            userCollection: {
                type: Types.ObjectId,
                ref: COLLECTION_MODEL
            }
        });
    }

    static create() {
        const schema = this.schema;
        return model(USER_MODEL, schema);
    }
}