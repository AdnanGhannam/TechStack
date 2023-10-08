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
const getArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const article = yield models_1.default.Article.findById(id)
        .populate("reactions creators")
        .populate({
        path: "section",
        select: "title"
    })
        .populate({
        path: "toolkit",
        select: "name"
    });
    if (!article) {
        const message = `Article with Id: '${id}' is not found`;
        logger_1.default.error(message);
        return res.status(404)
            .json((0, response_helpers_1.httpError)(message));
    }
    res.locals.article = article;
    next();
});
const getBody = (requires) => {
    const exec = (req, res, next) => {
        const { title, description, content, order } = req.body;
        if (requires == _1.Requires.All && (!title || !description || !content)) {
            return res.status(400)
                .json((0, response_helpers_1.httpError)("The 'title', 'description' and 'content' fields are required"));
        }
        if (requires == _1.Requires.Partial && !title && !description && !content && order == null) {
            return res.status(400)
                .json((0, response_helpers_1.httpError)(`One of the following fields is required: 'title', 'description', 'content' and 'order'`));
        }
        res.locals = Object.assign(Object.assign({}, res.locals), { title,
            description,
            content,
            order });
        next();
    };
    return { exec };
};
const getReactionType = (req, res, next) => {
    const { type } = req.query;
    if (!type || (type != "like" && type != "dislike")) {
        return res.status(400)
            .json((0, response_helpers_1.httpError)("The 'type' query parameter should be either 'like' or 'dislike'"));
    }
    res.locals.type = type;
    next();
};
const middlewares = {
    getArticle,
    getBody,
    getReactionType
};
exports.default = middlewares;
