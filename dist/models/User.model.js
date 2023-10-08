"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRIVILEGES = exports.USER_MODEL = void 0;
const mongoose_1 = require("mongoose");
const Collection_model_1 = require("./Collection.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = __importDefault(require("../config/env.config"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
exports.USER_MODEL = "User";
exports.PRIVILEGES = ["user", "administrator"];
class UserModel {
    static get schema() {
        return new mongoose_1.Schema({
            name: {
                type: String,
                required: [true, "The 'Name' field is required"],
                unique: true,
                validate: {
                    validator: function (value) {
                        return value.length >= 4 && value.length <= 20;
                    },
                    message: (props) => `'${props.path}' should be between 4 and 20 characters, your input is ${props.value.length} characters long.`
                }
            },
            email: {
                type: String,
                required: [true, "The 'Email' field is required"],
                match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                unique: true
            },
            phonenumber: {
                type: String,
                required: [true, "The 'Phonenumber' field is required"],
            },
            password: {
                type: String,
                required: [true, "The 'Password' field is required"],
            },
            privilege: {
                type: String,
                enum: exports.PRIVILEGES,
                default: exports.PRIVILEGES[0]
            },
            joinedAt: {
                type: Number,
                immutable: true,
                default: Date.now()
            },
            userCollection: {
                type: mongoose_1.Types.ObjectId,
                ref: Collection_model_1.COLLECTION_MODEL
            }
        });
    }
    static create() {
        const schema = this.schema;
        schema.plugin(mongoose_unique_validator_1.default, { message: "'{PATH}' is aleady used" });
        schema.methods.toJSON = function () {
            const user = this;
            const userObject = user.toObject();
            delete userObject.password;
            return userObject;
        };
        return (0, mongoose_1.model)(exports.USER_MODEL, schema);
    }
    /**
     *
     * @param password
     * @returns Null if valid or error message if not
     */
    static validatePassword(password) {
        const constraints = [/[A-Z]/g, /[a-z]/g, /[0-9]/g, /[^A-Za-z0-9]/g];
        let matches = true;
        constraints.forEach(constraint => {
            var _a, _b;
            matches = matches && ((_b = (_a = password.match(constraint)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) >= 1;
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
    static generateToken(user) {
        const { SECRET } = env_config_1.default;
        const expiresIn = 10800; // 3h;
        const token = jsonwebtoken_1.default.sign({ id: user.id }, SECRET, { expiresIn });
        return { token, privilege: user.privilege, expiresIn, id: user.id };
    }
}
exports.default = UserModel;
