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
exports.REMOVE_FEEDBACK = exports.SEND_FEEDBACK = exports.GET_FEEDBACKS = exports.UNREACT_TO_ARTICLE = exports.REACT_TO_ARTICLE = exports.REMOVE_ARTICLE = exports.UPDATE_ARTICLE = exports.GET_POPULARE_ARTICLES = exports.GET_ARTICLE = exports.GET_ALL_ARTICLES = void 0;
const articles_controller_1 = __importDefault(require("../controllers/articles.controller"));
const auth_middlewares_1 = __importDefault(require("../middlewares/auth.middlewares"));
const middlewares_1 = __importStar(require("../middlewares"));
const article_middlewares_1 = __importDefault(require("../middlewares/article.middlewares"));
exports.GET_ALL_ARTICLES = "/articles";
exports.GET_ARTICLE = "/articles/:id";
exports.GET_POPULARE_ARTICLES = "/populare/articles";
exports.UPDATE_ARTICLE = "/articles/:id";
exports.REMOVE_ARTICLE = "/articles/:id";
exports.REACT_TO_ARTICLE = "/react/articles/:id";
exports.UNREACT_TO_ARTICLE = "/react/articles/:id";
exports.GET_FEEDBACKS = "/feedbacks";
exports.SEND_FEEDBACK = "/articles/:id/send-feedback";
exports.REMOVE_FEEDBACK = "/feedbacks/:id";
const articleRoutes = (app) => {
    app.get(exports.GET_ALL_ARTICLES, [], articles_controller_1.default.getAllEndpoint);
    app.get(exports.GET_ARTICLE, [
        middlewares_1.default.checkId,
        article_middlewares_1.default.getArticle
    ], articles_controller_1.default.getByIdEndpoint);
    app.get(exports.GET_POPULARE_ARTICLES, [], articles_controller_1.default.getPopulareEndpoint);
    app.put(exports.UPDATE_ARTICLE, [
        auth_middlewares_1.default.authenticate,
        auth_middlewares_1.default.authorize,
        middlewares_1.default.checkId,
        article_middlewares_1.default.getArticle,
        article_middlewares_1.default.getBody(middlewares_1.Requires.Partial).exec
    ], articles_controller_1.default.updateEndpoint);
    app.delete(exports.REMOVE_ARTICLE, [
        auth_middlewares_1.default.authenticate,
        auth_middlewares_1.default.authorize,
        middlewares_1.default.checkId,
        article_middlewares_1.default.getArticle
    ], articles_controller_1.default.removeEndpoint);
    app.post(exports.REACT_TO_ARTICLE, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        article_middlewares_1.default.getArticle,
        article_middlewares_1.default.getReactionType,
    ], articles_controller_1.default.reactToEndpoint);
    app.delete(exports.UNREACT_TO_ARTICLE, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        article_middlewares_1.default.getArticle
    ], articles_controller_1.default.unReactToEndpoint);
    app.get(exports.GET_FEEDBACKS, [
        auth_middlewares_1.default.authenticate,
        auth_middlewares_1.default.authorize
    ], articles_controller_1.default.getFeedbacksEndpoint);
    app.post(exports.SEND_FEEDBACK, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        article_middlewares_1.default.getArticle
    ], articles_controller_1.default.sendFeedbackEndpoint);
    app.delete(exports.REMOVE_FEEDBACK, [
        auth_middlewares_1.default.authenticate,
        auth_middlewares_1.default.authorize,
        middlewares_1.default.checkId
    ], articles_controller_1.default.removeFeedbackEndpoint);
};
exports.default = articleRoutes;
