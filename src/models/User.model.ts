import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { COLLECTION_MODEL } from "./Collection.model";

export const USER_MODEL = "User";
export const PRIVILEGES = ["user", "administrator"];
export type TUser = InferSchemaType<typeof UserModel.schema>;
export type UserDocument = Document<unknown, {}, TUser> & TUser;

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
                match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
        schema.methods.toJSON = function() {
            const user = this;
            const userObject = user.toObject();
            delete userObject.password;
            return userObject;
        }

        return model(USER_MODEL, schema);
    }
}