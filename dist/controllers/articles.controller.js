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
const controller_helpers_1 = require("../helpers/controller.helpers");
const models_1 = __importDefault(require("../models"));
const logger_1 = __importDefault(require("../libraries/logger"));
const getAllEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articles = yield models_1.default.Article.find({})
        .populate({
        path: "creators",
        options: { limit: 1 }
    })
        .populate({
        path: "section",
        select: "title"
    })
        .populate({
        path: "toolkit",
        select: "name"
    });
    logger_1.default.info(`Return all articles`);
    res.json((0, response_helpers_1.httpSuccess)(articles));
});
const getByIdEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { article } = res.locals;
    yield article.updateOne({ $inc: { views: 1 } });
    logger_1.default.info(`Return article with Id: '${article.id}'`);
    res.status(200)
        .json((0, response_helpers_1.httpSuccess)(article));
});
const getPopulareEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const top = yield models_1.default.Article.find().sort("-views").limit(5).select("title description");
    logger_1.default.info(`Return top 5 articles`);
    res.json((0, response_helpers_1.httpSuccess)(top));
});
const updateEndpoint = (req, res) => {
    const { title, description, content } = res.locals;
    const { article, loginUser: user } = res.locals;
    if (!article.creators.includes(user.id)) {
        article.creators.push(user.id);
    }
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield article.updateOne({
            title: title || article.title,
            description: description || article.description,
            content: content || article.content,
            lastUpdateFrom: user.id
        }, { runValidators: true });
        logger_1.default.info(`Update article with Id: '${article.id}' by admin with Id: '${user.id}'`);
        res.status(204).end();
    }));
};
const removeEndpoint = (req, res) => {
    const { article, loginUser: user } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield article.deleteOne();
        yield models_1.default.Section.findByIdAndUpdate(article.section, { $pull: { articles: article.id } });
        logger_1.default.info(`Remove article with Id: '${article.id}' by admin with Id: '${user.id}'`);
        res.status(204).end();
    }));
};
const reactToEndpoint = (req, res) => {
    const { type } = res.locals;
    const { article } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const { loginUser } = res.locals;
        let reacted = false;
        article.reactions.forEach((reaction) => __awaiter(void 0, void 0, void 0, function* () {
            if (reaction.user == loginUser.id && reaction.article == article.id) {
                reacted = true;
                yield reaction.updateOne({ type });
                return;
            }
        }));
        if (!reacted) {
            const newReaction = yield models_1.default.Reaction.create({
                type,
                user: loginUser.id,
                article: article.id
            });
            yield article.updateOne({ $addToSet: { reactions: newReaction.id } });
        }
        logger_1.default.info(`React to article with Id: '${article.id}' by user with Id: '${loginUser.id}'`);
        res.status(204).end();
    }));
};
const unReactToEndpoint = (req, res) => {
    const { article, loginUser } = res.locals;
    let reactionId = "";
    article.reactions.forEach(reaction => {
        if (reaction.user == loginUser.id && reaction.article == article.id) {
            reactionId = reaction.id;
        }
    });
    if (!reactionId) {
        return res.status(404)
            .json((0, response_helpers_1.httpError)("You didn't react to this article"));
    }
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield article.updateOne({ $pull: { reactions: reactionId } });
        yield models_1.default.Reaction.deleteOne({ _id: reactionId });
        logger_1.default.info(`Unreact to article with Id: '${article.id}' by user with Id: '${loginUser.id}'`);
        res.status(204).end();
    }));
};
const getFeedbacksEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbacks = yield models_1.default.Feedback.find()
        .populate("user")
        .populate({
        path: "article",
        select: "title"
    });
    logger_1.default.info(`Return feedbacks`);
    res.status(200).json((0, response_helpers_1.httpSuccess)(feedbacks));
});
const sendFeedbackEndpoint = (req, res) => {
    const { text } = req.body;
    const { article, loginUser } = res.locals;
    if (!text) {
        return res.status(400)
            .json((0, response_helpers_1.httpError)("The 'text' field is required"));
    }
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const feedback = yield models_1.default.Feedback.create({
            user: loginUser.id,
            article: article.id,
            text
        });
        yield article.updateOne({ $addToSet: { feedbacks: feedback.id } });
        logger_1.default.info(`Send feedback to article with Id: '${article.id}' by user with Id: '${loginUser.id}'`);
        res.status(201)
            .json((0, response_helpers_1.httpSuccess)(feedback));
    }));
};
const removeFeedbackEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { loginUser: user } = res.locals;
    const feedback = yield models_1.default.Feedback.findByIdAndDelete(id);
    yield models_1.default.Article.findByIdAndUpdate(feedback === null || feedback === void 0 ? void 0 : feedback.article, { $pull: { feedbacks: id } });
    logger_1.default.info(`Send feedback with Id: '${feedback === null || feedback === void 0 ? void 0 : feedback.id}' by admin with Id: '${user.id}'`);
    res.status(204).end();
});
const controller = {
    getAllEndpoint,
    getByIdEndpoint,
    getPopulareEndpoint,
    updateEndpoint,
    removeEndpoint,
    reactToEndpoint,
    unReactToEndpoint,
    getFeedbacksEndpoint,
    sendFeedbackEndpoint,
    removeFeedbackEndpoint
};
exports.default = controller;
