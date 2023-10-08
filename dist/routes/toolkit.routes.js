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
exports.GET_ALL_SECTIONS_BY_TOOLKIT = exports.ADD_TO_TOOLKIT = exports.REMOVE_TOOLKIT = exports.UPDATE_TOOLKIT = exports.GET_TOOLKIT_BY_ID = exports.GET_ALL_TOOLKITS = exports.CREATE_TOOLKIT = void 0;
const toolkits_controller_1 = __importDefault(require("../controllers/toolkits.controller"));
const auth_middlewares_1 = __importDefault(require("../middlewares/auth.middlewares"));
const middlewares_1 = __importStar(require("../middlewares"));
const toolkit_middlewares_1 = __importDefault(require("../middlewares/toolkit.middlewares"));
const section_middlewares_1 = __importDefault(require("../middlewares/section.middlewares"));
exports.CREATE_TOOLKIT = "/toolkits";
exports.GET_ALL_TOOLKITS = "/toolkits";
exports.GET_TOOLKIT_BY_ID = "/toolkits/:id";
exports.UPDATE_TOOLKIT = "/toolkits/:id";
exports.REMOVE_TOOLKIT = "/toolkits/:id";
exports.ADD_TO_TOOLKIT = "/toolkits/section/:id";
exports.GET_ALL_SECTIONS_BY_TOOLKIT = "/toolkits/section/:id";
const toolkitRoutes = (app) => {
    app.post(exports.CREATE_TOOLKIT, [
        auth_middlewares_1.default.authenticate,
        auth_middlewares_1.default.authorize,
        toolkit_middlewares_1.default.getBody(middlewares_1.Requires.All).exec,
    ], toolkits_controller_1.default.createEndpoint);
    app.get(exports.GET_ALL_TOOLKITS, [], toolkits_controller_1.default.getAllEndpoint);
    app.get(exports.GET_TOOLKIT_BY_ID, [
        middlewares_1.default.checkId,
        toolkit_middlewares_1.default.getToolkit
    ], toolkits_controller_1.default.getByIdEndpoint);
    app.put(exports.UPDATE_TOOLKIT, [
        auth_middlewares_1.default.authenticate,
        auth_middlewares_1.default.authorize,
        middlewares_1.default.checkId,
        toolkit_middlewares_1.default.getBody(middlewares_1.Requires.Partial).exec,
        toolkit_middlewares_1.default.getToolkit
    ], toolkits_controller_1.default.updateEndpoint);
    app.delete(exports.REMOVE_TOOLKIT, [
        auth_middlewares_1.default.authenticate,
        auth_middlewares_1.default.authorize,
        middlewares_1.default.checkId,
        toolkit_middlewares_1.default.getToolkit
    ], toolkits_controller_1.default.removeEndpoint);
    app.post(exports.ADD_TO_TOOLKIT, [
        auth_middlewares_1.default.authenticate,
        auth_middlewares_1.default.authorize,
        middlewares_1.default.checkId,
        toolkit_middlewares_1.default.getToolkit,
        section_middlewares_1.default.getBody(middlewares_1.Requires.All).exec,
        section_middlewares_1.default.checkSectionType
    ], toolkits_controller_1.default.addToEndpoint);
    app.get(exports.GET_ALL_SECTIONS_BY_TOOLKIT, [
        section_middlewares_1.default.checkSectionType,
        middlewares_1.default.checkId,
        toolkit_middlewares_1.default.getToolkit
    ], toolkits_controller_1.default.getAllSectionsInEndpoint);
};
exports.default = toolkitRoutes;
