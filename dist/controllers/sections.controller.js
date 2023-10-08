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
const response_helpers_1 = require("../helpers/response.helpers");
const logger_1 = __importDefault(require("../libraries/logger"));
const getAllEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sections = yield models_1.default.Section.find({})
        .populate("creator")
        .populate({
        path: "toolkit",
        select: "name"
    });
    logger_1.default.info(`Return all sections`);
    res.json((0, response_helpers_1.httpSuccess)(sections));
});
const getByIdEndpoint = (req, res) => {
    const { section } = res.locals;
    logger_1.default.info(`Return section with Id: '${section.id}'`);
    res.status(200).json((0, response_helpers_1.httpSuccess)(section));
};
const updateEndpoint = (req, res) => {
    const { title, type } = res.locals;
    const { section, loginUser: user } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield section.updateOne({
            title: title || section.title,
            type: type || section.type
        });
        logger_1.default.info(`Update section with Id: '${section.id}' by admin with Id: '${user.id}'`);
        res.status(204).end();
    }));
};
const removeEndpoint = (req, res) => {
    const { section, loginUser: user } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield section.deleteOne();
        yield models_1.default.Toolkit.findByIdAndUpdate(section.id, { $pull: { sections: section.id } });
        yield models_1.default.Article.deleteMany({ _id: { $in: section.articles } });
        logger_1.default.info(`Remove section with Id: '${section.id}' by admin with Id: '${user.id}'`);
        res.status(204).end();
    }));
};
const addToEndpoint = (req, res) => {
    const { title, description, content, order } = res.locals;
    const { section, loginUser: user } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const article = yield models_1.default.Article.create({
            title,
            type: section.type,
            description,
            content,
            creators: [user.id],
            section: section.id,
            toolkit: section.toolkit
        });
        if (order != '' && order >= 0) {
            yield section.updateOne({
                $push: {
                    articles: {
                        $each: [article],
                        $position: order
                    }
                }
            });
        }
        else {
            yield section.updateOne({ $push: { articles: article } });
        }
        logger_1.default.info(`Add new article with Id: '${article.id}', to section with Id: '${section.id}' by admin with Id: '${user.id}'`);
        res.status(201).json((0, response_helpers_1.httpSuccess)(article));
    }));
};
const controller = {
    getAllEndpoint,
    getByIdEndpoint,
    updateEndpoint,
    removeEndpoint,
    addToEndpoint,
};
exports.default = controller;
