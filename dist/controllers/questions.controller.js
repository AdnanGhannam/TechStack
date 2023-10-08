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
const controller_helpers_1 = require("../helpers/controller.helpers");
const logger_1 = __importDefault(require("../libraries/logger"));
const getAllEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { toolkit } = res.locals;
    const questions = yield models_1.default.Question.find({ toolkit: toolkit.id }).populate("user");
    logger_1.default.info(`Return all questions`);
    res.json((0, response_helpers_1.httpSuccess)(questions));
});
const getByIdEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question } = res.locals;
    yield question.updateOne({ $inc: { views: 1 } });
    logger_1.default.info(`Return question with Id: '${question.id}'`);
    res.json((0, response_helpers_1.httpSuccess)(question));
});
const getPopulareEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const top = yield models_1.default.Question.find().sort("-views").limit(5).select("title");
    logger_1.default.info(`Return top 5 questions`);
    res.json((0, response_helpers_1.httpSuccess)(top));
});
const createEndpoint = (req, res) => {
    const { title, content } = res.locals;
    const { loginUser: user, toolkit } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const question = yield models_1.default.Question.create({ title, content, user: user.id, toolkit: toolkit.id });
        yield toolkit.updateOne({ $push: { questions: question.id } });
        logger_1.default.info(`Add new question with Id: '${question.id}' to toolkit with Id: '${toolkit.id}' by user with Id: '${user.id}'`);
        res.status(201).json((0, response_helpers_1.httpSuccess)(question));
    }));
};
const updateEndpoint = (req, res) => {
    const { title, content } = res.locals;
    const { question, loginUser: user } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield question.updateOne({
            title: title !== null && title !== void 0 ? title : question.title,
            content: content !== null && content !== void 0 ? content : question.content
        }, { runValidators: true });
        logger_1.default.info(`Update question with Id: '${question.id}' by user with Id: '${user.id}'`);
        res.status(204).end();
    }));
};
const removeEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question, loginUser: user } = res.locals;
    const toolkit = yield models_1.default.Toolkit.findById(question.toolkit);
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield question.deleteOne();
        yield models_1.default.Answer.deleteMany({ question: question.id });
        yield (toolkit === null || toolkit === void 0 ? void 0 : toolkit.updateOne({ $pull: { questions: question.id } }));
        logger_1.default.info(`Remove question with Id: '${question.id}' by user with Id: '${user.id}'`);
        res.status(204).end();
    }));
});
const voteEndpoint = (req, res) => {
    const { vote } = req.query;
    const { loginUser: user, question } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const oldVote = yield models_1.default.Vote.findOne({ on: question.id });
        if (!oldVote) {
            const newVote = yield models_1.default.Vote.create({
                on: question.id,
                user: user.id,
                value: vote == "up" ? 1 : -1
            });
            yield question.updateOne({ $push: { votes: newVote.id } });
        }
        else {
            yield oldVote.updateOne({ value: vote == "up" ? 1 : -1 });
        }
        logger_1.default.info(`User with Id: '${user.id}' voted to question with Id: '${question.id}'`);
        res.status(204).end();
    }));
};
const unvoteEndpoint = (req, res) => {
    const { loginUser: user, question } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const vote = yield models_1.default.Vote.findOneAndDelete({ user: user.id });
        yield question.updateOne({ $pull: { votes: vote === null || vote === void 0 ? void 0 : vote.id } });
        logger_1.default.info(`User with Id: '${user.id}' unvoted to question with Id: '${question.id}'`);
        res.status(204).end();
    }));
};
const openCloseEndpoint = (req, res) => {
    const { state } = req.query;
    const { question, loginUser: user } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield question.updateOne({ isOpen: state == "true" });
        logger_1.default.info(`User with Id: '${user.id}' updated state of question with Id: '${question.id}'`);
        res.status(204).end();
    }));
};
const answerEndpoint = (req, res) => {
    const { content } = res.locals;
    const { loginUser: user, question } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const answer = yield models_1.default.Answer.create({
            user: user.id,
            content
        });
        yield question.updateOne({ $push: { answers: answer.id } });
        logger_1.default.info(`User with Id: '${user.id}' answered question with Id: '${question.id}'`);
        res.status(201).json((0, response_helpers_1.httpSuccess)(answer));
    }));
};
const controller = {
    getAllEndpoint,
    getByIdEndpoint,
    getPopulareEndpoint,
    createEndpoint,
    updateEndpoint,
    removeEndpoint,
    voteEndpoint,
    unvoteEndpoint,
    openCloseEndpoint,
    answerEndpoint
};
exports.default = controller;
