"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANSWER_QUESTION = exports.OPEN_CLOSE_QUESTION = exports.UNVOTE_TO_QUESTION = exports.VOTE_TO_QUESTION = exports.REMOVE_QUESTION = exports.UPDATE_QUESTION = exports.CREATE_QUESTION = exports.GET_POPULARE_QUESTIONS = exports.GET_QUESTION_BY_ID = exports.GET_QUESTIONS = void 0;
const questions_controller_1 = __importDefault(require("../controllers/questions.controller"));
const middlewares_1 = __importStar(require("../middlewares"));
const auth_middlewares_1 = __importDefault(require("../middlewares/auth.middlewares"));
const question_middlewares_1 = __importDefault(require("../middlewares/question.middlewares"));
const answer_middlewares_1 = __importDefault(require("../middlewares/answer.middlewares"));
const toolkit_middlewares_1 = __importDefault(require("../middlewares/toolkit.middlewares"));
exports.GET_QUESTIONS = "/questions/toolkits/:id";
exports.GET_QUESTION_BY_ID = "/questions/:id";
exports.GET_POPULARE_QUESTIONS = "/populare/questions";
exports.CREATE_QUESTION = "/questions/toolkits/:id";
exports.UPDATE_QUESTION = "/questions/:id";
exports.REMOVE_QUESTION = "/questions/:id";
exports.VOTE_TO_QUESTION = "/questions/vote/:id";
exports.UNVOTE_TO_QUESTION = "/questions/vote/:id";
exports.OPEN_CLOSE_QUESTION = "/questions/open_close/:id";
exports.ANSWER_QUESTION = "/questions/answer/:id";
const questionRoutes = (app) => {
    app.get(exports.GET_QUESTIONS, [
        middlewares_1.default.checkId,
        toolkit_middlewares_1.default.getToolkit
    ], questions_controller_1.default.getAllEndpoint);
    app.get(exports.GET_QUESTION_BY_ID, [
        middlewares_1.default.checkId,
        question_middlewares_1.default.getQuestion
    ], questions_controller_1.default.getByIdEndpoint);
    app.get(exports.GET_POPULARE_QUESTIONS, [], questions_controller_1.default.getPopulareEndpoint);
    app.post(exports.CREATE_QUESTION, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        toolkit_middlewares_1.default.getToolkit,
        question_middlewares_1.default.getBody(middlewares_1.Requires.All).exec
    ], questions_controller_1.default.createEndpoint);
    app.put(exports.UPDATE_QUESTION, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        question_middlewares_1.default.getQuestion,
        question_middlewares_1.default.canModify,
        question_middlewares_1.default.getBody(middlewares_1.Requires.Partial).exec
    ], questions_controller_1.default.updateEndpoint);
    app.delete(exports.REMOVE_QUESTION, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        question_middlewares_1.default.getQuestion,
        question_middlewares_1.default.canModify
    ], questions_controller_1.default.removeEndpoint);
    app.post(exports.VOTE_TO_QUESTION, [
        auth_middlewares_1.default.authenticate,
        question_middlewares_1.default.getVote,
        middlewares_1.default.checkId,
        question_middlewares_1.default.getQuestion
    ], questions_controller_1.default.voteEndpoint);
    app.delete(exports.UNVOTE_TO_QUESTION, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        question_middlewares_1.default.getQuestion
    ], questions_controller_1.default.unvoteEndpoint);
    app.put(exports.OPEN_CLOSE_QUESTION, [
        auth_middlewares_1.default.authenticate,
        question_middlewares_1.default.getState,
        middlewares_1.default.checkId,
        question_middlewares_1.default.getQuestion,
        question_middlewares_1.default.canModify
    ], questions_controller_1.default.openCloseEndpoint);
    app.post(exports.ANSWER_QUESTION, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        answer_middlewares_1.default.getBody,
        question_middlewares_1.default.getQuestion
    ], questions_controller_1.default.answerEndpoint);
};
exports.default = questionRoutes;
