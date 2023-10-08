"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REMOVE_FROM_COLLECTION = exports.ADD_TO_COLLECTION = exports.GET_COLLECTION = exports.GET_MY_QUESTIONS = exports.REMOVE_USER_BY_ID = exports.UPDATE_USER_BY_ID = exports.GET_USER_BY_ID = exports.REMOVE_USER = exports.CHANGE_PASSWORD = exports.UPDATE_USER = exports.GET_USER = exports.GET_USERS = exports.REGISTER = exports.ADMINS_LOGIN = exports.LOGIN = void 0;
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const user_middlewares_1 = __importDefault(require("../middlewares/user.middlewares"));
const article_middlewares_1 = __importDefault(require("../middlewares/article.middlewares"));
const auth_middlewares_1 = __importDefault(require("../middlewares/auth.middlewares"));
const middlewares_1 = __importDefault(require("../middlewares"));
exports.LOGIN = "/login";
exports.ADMINS_LOGIN = "/admins/login";
exports.REGISTER = "/register";
exports.GET_USERS = "/users";
exports.GET_USER = "/user";
exports.UPDATE_USER = "/user";
exports.CHANGE_PASSWORD = "/user/change-password";
exports.REMOVE_USER = "/user";
exports.GET_USER_BY_ID = "/users/:id";
exports.UPDATE_USER_BY_ID = "/users/:id";
exports.REMOVE_USER_BY_ID = "/users/:id";
exports.GET_MY_QUESTIONS = "/user/my-questions";
exports.GET_COLLECTION = "/collection";
exports.ADD_TO_COLLECTION = "/collection/:id";
exports.REMOVE_FROM_COLLECTION = "/collection/:id";
const userRoutes = (app) => {
    app.post(exports.ADMINS_LOGIN, [
        user_middlewares_1.default.getBody,
        user_middlewares_1.default.getUserByName,
        user_middlewares_1.default.checkPassword
    ], users_controller_1.default.loginEndpoint);
    app.post(exports.LOGIN, [
        user_middlewares_1.default.getBody,
        user_middlewares_1.default.getUserByName,
        user_middlewares_1.default.checkPassword
    ], users_controller_1.default.loginEndpoint);
    app.post(exports.REGISTER, [
        user_middlewares_1.default.getBody,
        user_middlewares_1.default.cryptPassword
    ], users_controller_1.default.registerEndpoint);
    app.get(exports.GET_USERS, [
        auth_middlewares_1.default.authenticate,
        auth_middlewares_1.default.authorize,
    ], users_controller_1.default.getAllEndpoint);
    app.get(exports.GET_USER, [
        auth_middlewares_1.default.authenticate
    ], users_controller_1.default.getEndpoint);
    app.put(exports.UPDATE_USER, [
        auth_middlewares_1.default.authenticate,
        user_middlewares_1.default.getBody
    ], users_controller_1.default.updateEndpoint);
    app.put(exports.CHANGE_PASSWORD, [
        auth_middlewares_1.default.authenticate,
        user_middlewares_1.default.getBody,
        user_middlewares_1.default.checkPassword,
        user_middlewares_1.default.cryptPassword
    ], users_controller_1.default.changePasswordEndpoint);
    app.delete(exports.REMOVE_USER, [
        auth_middlewares_1.default.authenticate,
    ], users_controller_1.default.removeEndpoint);
    app.get(exports.GET_USER_BY_ID, [
        middlewares_1.default.checkId,
        user_middlewares_1.default.getUserById
    ], users_controller_1.default.getByIdEndpoint);
    app.put(exports.UPDATE_USER_BY_ID, [
        auth_middlewares_1.default.authenticate,
        user_middlewares_1.default.getUserById,
        auth_middlewares_1.default.authorize,
        middlewares_1.default.checkId,
        user_middlewares_1.default.getBody
    ], users_controller_1.default.updateByIdEndpoint);
    app.delete(exports.REMOVE_USER_BY_ID, [
        auth_middlewares_1.default.authenticate,
        user_middlewares_1.default.getUserById,
        auth_middlewares_1.default.authorize,
        middlewares_1.default.checkId
    ], users_controller_1.default.removeByIdEndpoint);
    app.get(exports.GET_MY_QUESTIONS, [
        auth_middlewares_1.default.authenticate
    ], users_controller_1.default.getMyQuestionsEndpoint);
    app.get(exports.GET_COLLECTION, [
        auth_middlewares_1.default.authenticate
    ], users_controller_1.default.getCollectionEndpoint);
    app.post(exports.ADD_TO_COLLECTION, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        article_middlewares_1.default.getArticle,
    ], users_controller_1.default.addToCollectionEndpoint);
    app.delete(exports.REMOVE_FROM_COLLECTION, [
        auth_middlewares_1.default.authenticate,
        middlewares_1.default.checkId,
        article_middlewares_1.default.getArticle,
    ], users_controller_1.default.removeFromCollectionEndpoint);
};
exports.default = userRoutes;
