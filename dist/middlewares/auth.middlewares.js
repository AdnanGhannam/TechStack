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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = __importDefault(require("../config/env.config"));
const response_helpers_1 = require("../helpers/response.helpers");
const mongoose_1 = require("mongoose");
const models_1 = __importDefault(require("../models"));
const logger_1 = __importDefault(require("../libraries/logger"));
/**
 * @passes loginUser
*/
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(403)
            .json((0, response_helpers_1.httpError)("You have to login first"));
    }
    const { SECRET } = env_config_1.default;
    jsonwebtoken_1.default.verify(token, SECRET, (err, doc) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(400)
                .json((0, response_helpers_1.httpError)("JWT token is not valid"));
        }
        const userId = doc === null || doc === void 0 ? void 0 : doc["id"];
        if (!userId) {
            return res.status(400)
                .json((0, response_helpers_1.httpError)("JWT token is not valid!"));
        }
        if (!mongoose_1.Types.ObjectId.isValid(userId)) {
            return res.status(400).json((0, response_helpers_1.httpError)(`Id is not valid`));
        }
        const user = yield models_1.default.User.findById(userId);
        if (!user) {
            const message = `User with Id: '${userId}' is not found`;
            logger_1.default.error(message);
            return res.status(404).json((0, response_helpers_1.httpError)(message));
        }
        res.locals.loginUser = user;
        next();
    }));
};
/**
 * @requires LoginUser
 * @passes Privilege
*/
const authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginUser } = res.locals;
    if (loginUser.privilege != "administrator") {
        logger_1.default.error(`User with Id: '${loginUser.id}' is trying to preform admin task`);
        return res.status(401)
            .json((0, response_helpers_1.httpError)("You don't have privilege to make this action"));
    }
    res.locals.privilege = loginUser.privilege;
    next();
});
const auth = {
    authenticate,
    authorize
};
exports.default = auth;
