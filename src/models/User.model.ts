import { Document, InferSchemaType, Schema, Types, model } from "mongoose";
import { COLLECTION_MODEL } from "./Collection.model";
import jwt from 'jsonwebtoken';
import env from "../config/env.config";

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
            phonenumber: {
                type: String,
                required: true
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

    /**
     * 
     * @param password
     * @returns Null if valid or error message if not
     */
    static validatePassword(password: string) {
        const constraints: RegExp[] = [/[A-Z]/g, /[a-z]/g, /[0-9]/g, /[^A-Za-z0-9]/g];

        let matches = true;

        constraints.forEach(constraint => {
            // TODO test this
            matches = matches && (password.match(constraint)?.length ?? 0) >= 1;
        });
        
        if (!matches) {
            return "Password should contain at least: " +
                                            "1 uppercase letters, " +
                                            "1 lowercase letters, " +
                                            "1 numbers, " +
                                            "1 special characters.";
        }

        if (password.length < 10) {
            return "Password is too short (min length is 10)";
        }

        return null;
    }

    static generateToken(user: UserDocument) {
        const { SECRET } = env;

        const expiresIn = 10800 // 3h;

        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn });

        return { token, privilege: user.privilege, expiresIn, id: user.id };
    }
}