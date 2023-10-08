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
const logger_1 = __importDefault(require("../libraries/logger"));
const getAnswer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const answer = yield models_1.default.Answer.findById(id);
    if (!answer) {
        const message = `Answer with Id: '${id}' is not found`;
        logger_1.default.error(message);
        return res.status(404)
            .json((0, response_helpers_1.httpError)(message));
    }
    res.locals.answer = answer;
    next();
});
const getBody = (req, res, next) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400)
            .json((0, response_helpers_1.httpError)(`The 'content' field is required`));
    }
    res.locals.content = content;
    next();
};
const canModify = (req, res, next) => {
    const { loginUser: user, answer } = res.locals;
    if (answer.user != user && user.privilege != "administrator") {
        logger_1.default.error(`User with Id: '${user.id}' tried to modify answer with Id: '${answer.id}'`);
        return res.status(401)
            .json((0, response_helpers_1.httpError)("You don't have privilege to make this action"));
    }
    next();
};
const middlewares = {
    getAnswer,
    getBody,
    canModify
};
exports.default = middlewares;
