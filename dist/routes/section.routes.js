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
exports.ADD_TO_SECTION = exports.REMOVE_SECTION = exports.UPDATE_SECTION = exports.GET_SECTION = exports.GET_ALL_SECTIONS = void 0;
const sections_controller_1 = __importDefault(require("../controllers/sections.controller"));
const section_middlewares_1 = __importDefault(require("../middlewares/section.middlewares"));
const auth_middlewares_1 = __importDefault(require("../middlewares/auth.middlewares"));
const middlewares_1 = __importStar(require("../middlewares"));
const article_middlewares_1 = __importDefault(require("../middlewares/article.middlewares"));
exports.GET_ALL_SECTIONS = "/sections";
exports.GET_SECTION = "/sections/:id";
exports.UPDATE_SECTION = "/sections/:id";
exports.REMOVE_SECTION = "/sections/:id";
exports.ADD_TO_SECTION = "/sections/article/:id";
const sectionRoutes = (app) => {
    app.get(exports.GET_ALL_SECTIONS, [], sections_controller_1.default.getAllEndpoint);
    app.get(exports.GET_SECTION, [
        middlewares_1.default.checkId,
        section_middlewares_1.default.checkSectionType,
        section_middlewares_1.default.getSection
    ], sections_controller_1.default.getByIdEndpoint);
    app.put(exports.UPDATE_SECTION, [
        auth_middlewares_1.default.authenticate,
        auth_middlewares_1.default.authorize,
        middlewares_1.default.checkId,
        section_middlewares_1.default.getBody(middlewares_1.Requires.Partial).exec,
        section_middlewares_1.default.getSection
    ], sections_controller_1.default.updateEndpoint);
    app.delete(exports.REMOVE_SECTION, [
        auth_middlewares_1.default.authenticate,
        auth_middlewares_1.default.authorize,
        middlewares_1.default.checkId,
        section_middlewares_1.default.getSection
    ], sections_controller_1.default.removeEndpoint);
    app.post(exports.ADD_TO_SECTION, [
        auth_middlewares_1.default.authenticate,
        auth_middlewares_1.default.authorize,
        middlewares_1.default.checkId,
        article_middlewares_1.default.getBody(middlewares_1.Requires.All).exec,
        section_middlewares_1.default.getSection
    ], sections_controller_1.default.addToEndpoint);
};
exports.default = sectionRoutes;
