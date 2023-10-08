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
const models_1 = __importDefault(require("../models"));
const response_helpers_1 = require("../helpers/response.helpers");
const _1 = require(".");
const logger_1 = __importDefault(require("../libraries/logger"));
const getQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const question = yield models_1.default.Question.findById(id)
        .populate("user")
        .populate("votes")
        .populate({
        path: "answers",
        populate: { path: "user votes" }
    });
    if (!question) {
        const message = `Question with Id: '${id}' is not found`;
        logger_1.default.error(message);
        return res.status(404)
            .json((0, response_helpers_1.httpError)(message));
    }
    res.locals.question = question;
    next();
});
const getBody = (requires) => {
    const exec = (req, res, next) => {
        const { title, content } = req.body;
        if (requires == _1.Requires.All && (!title || !content)) {
            return res.status(400)
                .json((0, response_helpers_1.httpError)("The 'title' and 'content' fields are required"));
        }
        if (requires == _1.Requires.Partial && !title && !content) {
            return res.status(400)
                .json((0, response_helpers_1.httpError)(`One of the following fields is required: 'title' and 'content'`));
        }
        res.locals = Object.assign(Object.assign({}, res.locals), { title,
            content });
        next();
    };
    return { exec };
};
const canModify = (req, res, next) => {
    const { loginUser: user, question } = res.locals;
    if (question.user.id != user.id && user.privilege != "administrator") {
        logger_1.default.error(`User with Id: '${user.id}' tried to modify question with Id: '${question.id}'`);
        return res.status(401)
            .json((0, response_helpers_1.httpError)("You don't have privilege to make this action"));
    }
    next();
};
const getVote = (req, res, next) => {
    const { vote } = req.query;
    if (!vote || (vote != "up" && vote != "down")) {
        return res.status(400)
            .json(`The 'vote' query should be either 'up' or 'down'`);
    }
    next();
};
const getState = (req, res, next) => {
    const { state } = req.query;
    if (!state || (state != "true" && state != "false")) {
        return res.status(400)
            .json(`The 'state' query should be either 'true' or 'false'`);
    }
    next();
};
const middlewares = {
    getQuestion,
    getBody,
    canModify,
    getVote,
    getState
};
exports.default = middlewares;
