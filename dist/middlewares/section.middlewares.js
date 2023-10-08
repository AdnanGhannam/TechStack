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
const Section_model_1 = require("../models/Section.model");
const _1 = require(".");
const logger_1 = __importDefault(require("../libraries/logger"));
const getSection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const section = yield models_1.default.Section.findById(id).populate("articles", "title description createdAt");
    if (!section) {
        const message = `Section with Id: '${id}' is not found`;
        logger_1.default.error(message);
        return res.status(404)
            .json((0, response_helpers_1.httpError)(message));
    }
    res.locals.section = section;
    next();
});
const getBody = (requires) => {
    const exec = (req, res, next) => {
        const { title, type, order } = req.body;
        if (requires == _1.Requires.All && (!title || !type)) {
            return res.status(400)
                .json((0, response_helpers_1.httpError)("The 'title' and 'type' fields are required"));
        }
        if (requires == _1.Requires.Partial && !title && !type && order == null) {
            return res.status(400)
                .json((0, response_helpers_1.httpError)(`One of the following fields is required: 'title', 'type' and 'order'`));
        }
        res.locals = Object.assign(Object.assign({}, res.locals), { title,
            type,
            order });
        next();
    };
    return { exec };
};
const checkSectionType = (req, res, next) => {
    const type = res.locals.type || req.query.type;
    if (!type || !Section_model_1.SECTION_TYPES.includes(`${type}`)) {
        return res.status(400)
            .json((0, response_helpers_1.httpError)("The 'type' should be either 'reference' or 'tutorial'"));
    }
    res.locals.type = type;
    next();
};
const middlewares = {
    getSection,
    getBody,
    checkSectionType
};
exports.default = middlewares;
