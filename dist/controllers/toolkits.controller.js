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
const createEndpoint = (req, res) => {
    const { loginUser: user } = res.locals;
    const { name, description, type, company } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const toolkit = yield models_1.default.Toolkit.create({
            name,
            description,
            type,
            company,
            creator: user.id
        });
        logger_1.default.info(`New toolkit create with Id: '${toolkit.id}'`);
        res.status(201).json((0, response_helpers_1.httpSuccess)(toolkit));
    }));
};
const getAllEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { include } = req.query;
    let toolkits = models_1.default.Toolkit.find().populate("creator");
    if (include == "true") {
        toolkits = toolkits.populate({
            path: "sections",
            options: { limit: 8 },
            select: "title type"
        });
    }
    logger_1.default.info(`Return all toolkits`);
    res.json((0, response_helpers_1.httpSuccess)(yield toolkits));
});
const getByIdEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { toolkit } = res.locals;
    logger_1.default.info(`Return toolkit with Id: '${toolkit.id}'`);
    res.json((0, response_helpers_1.httpSuccess)(toolkit));
});
const updateEndpoint = (req, res) => {
    const { name, description, type, company } = res.locals;
    const { toolkit, loginUser: user } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield toolkit.updateOne({
            name: name !== null && name !== void 0 ? name : toolkit.name,
            description: description !== null && description !== void 0 ? description : toolkit.description,
            type: type !== null && type !== void 0 ? type : toolkit.type,
            company: company !== null && company !== void 0 ? company : toolkit.company
        });
        logger_1.default.info(`Update toolkit with Id: '${toolkit.id}' by admin with Id: '${user.id}'`);
        res.status(204).end();
    }));
};
const removeEndpoint = (req, res) => {
    const { toolkit, loginUser: user } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield toolkit.deleteOne();
        yield models_1.default.Section.deleteMany({ toolkit: toolkit.id });
        yield models_1.default.Article.deleteMany({ toolkit: toolkit.id });
        yield models_1.default.Question.deleteMany({ toolkit: toolkit.id });
        logger_1.default.info(`Remove toolkit with Id: '${toolkit.id}' by admin with Id: '${user.id}'`);
        res.status(204).end();
    }));
};
const addToEndpoint = (req, res) => {
    const { loginUser, toolkit } = res.locals;
    const { title, type, order } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const section = yield models_1.default.Section.create({
            toolkit: toolkit.id,
            title,
            type,
            creator: loginUser.id,
        });
        if (order != '' && order >= 0) {
            yield toolkit.updateOne({
                $push: {
                    sections: {
                        $each: [section],
                        $position: order
                    }
                }
            });
        }
        else {
            yield toolkit.updateOne({ $push: { sections: section } });
        }
        logger_1.default.info(`Add new section with Id: '${section.id}', to toolkit with Id: '${toolkit.id}' by admin with Id: '${loginUser.id}'`);
        res.status(201).json((0, response_helpers_1.httpSuccess)(section));
    }));
};
const getAllSectionsInEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: toolkitId } = req.params;
    const { type } = res.locals;
    const sections = yield models_1.default.Section.find({ type, toolkit: toolkitId })
        .populate("articles", "title description");
    logger_1.default.info(`Return all sections in toolkit with Id: '${toolkitId}'`);
    res.status(200)
        .json((0, response_helpers_1.httpSuccess)(sections));
});
const controller = {
    createEndpoint,
    getAllEndpoint,
    getByIdEndpoint,
    updateEndpoint,
    removeEndpoint,
    addToEndpoint,
    getAllSectionsInEndpoint
};
exports.default = controller;
