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
const controller_helpers_1 = require("../helpers/controller.helpers");
const models_1 = __importDefault(require("../models"));
const logger_1 = __importDefault(require("../libraries/logger"));
const updateEndpoint = (req, res) => {
    const { answer } = res.locals;
    const { content } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield answer.updateOne({
            content,
            lastModifyAt: Date.now()
        }, { runValidators: true });
        logger_1.default.info(`Update answer with Id: '${answer.id}'`);
        res.status(204).end();
    }));
};
const removeEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { answer } = res.locals;
    const question = yield models_1.default.Question.findById(answer.question);
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield answer.deleteOne();
        question === null || question === void 0 ? void 0 : question.updateOne({ $pull: { answers: answer.id } });
        logger_1.default.info(`Remove answer with Id: '${answer.id}'`);
        res.status(204).end();
    }));
});
const voteEndpoint = (req, res) => {
    const { vote } = req.query;
    const { loginUser: user, answer } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const oldVote = yield models_1.default.Vote.findOne({ on: answer.id });
        if (!oldVote) {
            const newVote = yield models_1.default.Vote.create({
                on: answer.id,
                user: user.id,
                value: vote == "up" ? 1 : -1
            });
            yield answer.updateOne({ $push: { votes: newVote.id } });
        }
        else {
            yield oldVote.updateOne({ value: vote == "up" ? 1 : -1 });
        }
        logger_1.default.info(`User with Id: '${user.id}' voted to answer with Id: '${answer.id}'`);
        res.status(204).end();
    }));
};
const unvoteEndpoint = (req, res) => {
    const { loginUser: user, answer } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const vote = yield models_1.default.Vote.findOneAndDelete({ user: user.id });
        yield answer.updateOne({ $pull: { votes: vote === null || vote === void 0 ? void 0 : vote.id } });
        logger_1.default.info(`User with Id: '${user.id}' unvoted to answer with Id: '${answer.id}'`);
        res.status(204).end();
    }));
};
const makeAsCorrectEndpoint = (req, res) => {
    const { answer } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield answer.updateOne({ isCorrect: true });
        logger_1.default.info(`Answer with Id: '${answer.id}' is marked as 'correct'`);
        res.status(204).end();
    }));
};
const controller = {
    updateEndpoint,
    removeEndpoint,
    voteEndpoint,
    unvoteEndpoint,
    makeAsCorrectEndpoint
};
exports.default = controller;
