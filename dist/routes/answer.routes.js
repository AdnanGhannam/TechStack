"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARK_AS_CORRECT = exports.UNVOTE_TO_ANSWER = exports.VOTE_TO_ANSWER = exports.REMOVE_ANSWER = exports.UPDATE_ANSWER = void 0;
const answers_controller_1 = __importDefault(require("../controllers/answers.controller"));
const auth_middlewares_1 = __importDefault(require("../middlewares/auth.middlewares"));
const answer_middlewares_1 = __importDefault(require("../middlewares/answer.middlewares"));
const question_middlewares_1 = __importDefault(require("../middlewares/question.middlewares"));
const middlewares_1 = __importDefault(require("../middlewares"));
exports.UPDATE_ANSWER = "/answers/:id";
exports.REMOVE_ANSWER = "/answers/:id";
exports.VOTE_TO_ANSWER = "/answers/vote/:id";
exports.UNVOTE_TO_ANSWER = "/answers/vote/:id";
exports.MARK_AS_CORRECT = "/answers/correct/:id";
const answerRoutes = (app) => {
    app.put(exports.UPDATE_ANSWER, [
        auth_middlewares_1.default.authenticate,
        answer_middlewares_1.default.getBody,
        middlewares_1.default.checkId,
        answer_middlewares_1.default.getAnswer,
        answer_middlewares_1.default.canModify
    ], answers_controller_1.default.updateEndpoint);
    app.delete(exports.REMOVE_ANSWER, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        answer_middlewares_1.default.getAnswer,
        answer_middlewares_1.default.canModify
    ], answers_controller_1.default.removeEndpoint);
    app.post(exports.VOTE_TO_ANSWER, [
        auth_middlewares_1.default.authenticate,
        question_middlewares_1.default.getVote,
        middlewares_1.default.checkId,
        answer_middlewares_1.default.getAnswer
    ], answers_controller_1.default.voteEndpoint);
    app.delete(exports.UNVOTE_TO_ANSWER, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        answer_middlewares_1.default.getAnswer
    ], answers_controller_1.default.unvoteEndpoint);
    app.put(exports.MARK_AS_CORRECT, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        answer_middlewares_1.default.getAnswer,
        answer_middlewares_1.default.canModify
    ], answers_controller_1.default.makeAsCorrectEndpoint);
};
exports.default = answerRoutes;
