"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_helpers_1 = require("../helpers/response.helpers");
const models_1 = __importDefault(require("../models"));
const user_routes_1 = require("../routes/user.routes");
const crypto_1 = require("crypto");
const User_model_1 = __importDefault(require("../models/User.model"));
const logger_1 = __importDefault(require("../libraries/logger"));
/**
 * @passes Name, Email, Password, NewPassword
 */
const getBody = (req, res, next) => {
    const { name, email, phonenumber, password, newPassword } = req.body;
    switch (req.route.path) {
        case user_routes_1.LOGIN:
            if (!name || !password) {
                return res.status(400)
                    .json((0, response_helpers_1.httpError)("The 'name' and 'password' fields are required"));
            }
            break;
        case user_routes_1.REGISTER:
            if (!name || !email || !phonenumber || !password) {
                return res.status(400)
                    .json((0, response_helpers_1.httpError)("The 'name', 'email', 'phonenumber' and 'password' fields are required"));
            }
            break;
        case user_routes_1.CHANGE_PASSWORD:
            if (!password || !newPassword) {
                return res.status(400)
                    .json((0, response_helpers_1.httpError)("The 'password' and 'newPassword' fields are required"));
            }
            break;
        default:
            if (!name && !email && !phonenumber) {
                return res.status(400)
                    .json((0, response_helpers_1.httpError)(`One of the following fields is required: 'name', 'email' and 'phonenumber'`));
            }
            break;
    }
    ;
    res.locals = Object.assign(Object.assign({}, res.locals), { name,
        email,
        phonenumber,
        password,
        newPassword });
    next();
};
/**
 * @requires Name
 * @passes User
 */
const getUserByName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const name = res.locals.name;
    const user = yield models_1.default.User.findOne({ name });
    if (!user) {
        const message = `User with name: '${name}' is not found`;
        logger_1.default.error(message);
        return res.status(404)
            .json((0, response_helpers_1.httpError)(message));
    }
    res.locals.user = user;
    next();
});
/**
 * @passes User
 */
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield models_1.default.User.findById(id);
    if (!user) {
        const message = `User with id: '${id}' is not found`;
        logger_1.default.error(message);
        return res.status(404)
            .json((0, response_helpers_1.httpError)(message));
    }
    res.locals.user = user;
    next();
});
/**
 * @requires User, Password
 */
const checkPassword = (req, res, next) => {
    const { loginUser, user } = res.locals;
    const { password } = res.locals;
    const hashed = (0, crypto_1.createHash)('sha256').update(password).digest('hex');
    if ((loginUser && loginUser.password != hashed) || (user && user.password != hashed)) {
        logger_1.default.error(`Someone tried to access user with Id: '${user.id}' account with a wrong password`);
        return res.status(400)
            .json((0, response_helpers_1.httpError)(`Password is wrong`));
    }
    next();
};
/**
 * @requires Password
 * @passes PasswordHash
 */
const cryptPassword = (req, res, next) => {
    const { password, newPassword } = res.locals;
    const errorMessage = User_model_1.default.validatePassword(newPassword || password);
    if (errorMessage) {
        return res.status(400).json((0, response_helpers_1.httpError)(errorMessage));
    }
    res.locals.password = (0, crypto_1.createHash)('sha256').update(newPassword !== null && newPassword !== void 0 ? newPassword : password).digest('hex');
    next();
};
const middlewares = {
    getBody,
    getUserByName,
    getUserById,
    checkPassword,
    cryptPassword
};
exports.default = middlewares;
