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
const getBody = (requires) => {
    const exec = (req, res, next) => {
        const { name, description, type, company } = req.body;
        if (requires == _1.Requires.All && (!name || !description || !type || !company)) {
            return res.status(400)
                .json((0, response_helpers_1.httpError)("The 'name', 'description', 'type' and 'company' fields are required"));
        }
        if (requires == _1.Requires.Partial && !name && !description && !type && !company) {
            return res.status(400)
                .json((0, response_helpers_1.httpError)("One of the following fields is required: 'name', 'description', 'type' and 'company'"));
        }
        res.locals = Object.assign(Object.assign({}, res.locals), { name,
            description,
            type,
            company });
        next();
    };
    return { exec };
};
const getToolkit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const toolkit = yield models_1.default.Toolkit.findById(id).populate("creator");
    if (!toolkit) {
        const message = `Toolkit with id: '${id}' is not found`;
        logger_1.default.error(message);
        return res.status(404)
            .json((0, response_helpers_1.httpError)(message));
    }
    res.locals.toolkit = toolkit;
    next();
});
const middlewares = {
    getBody,
    getToolkit
};
exports.default = middlewares;
