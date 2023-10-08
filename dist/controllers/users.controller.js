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
const mongoose_1 = require("mongoose");
const models_1 = __importDefault(require("../models"));
const controller_helpers_1 = require("../helpers/controller.helpers");
const User_model_1 = __importDefault(require("../models/User.model"));
const user_routes_1 = require("../routes/user.routes");
const logger_1 = __importDefault(require("../libraries/logger"));
const loginEndpoint = (req, res) => {
    const { user } = res.locals;
    if (req.route.path == user_routes_1.ADMINS_LOGIN && user.privilege != "administrator") {
        logger_1.default.warn(`User with Id: '${user.id}' tried to login to the dashboard`);
        return res.status(401)
            .json((0, response_helpers_1.httpError)("Only admins can login here"));
    }
    logger_1.default.info(`User with Id: '${user.id}' logged in`);
    res.status(200).json((0, response_helpers_1.httpSuccess)(User_model_1.default.generateToken(user)));
};
const registerEndpoint = (req, res) => {
    const { name, email, password, phonenumber } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        const collectionId = new mongoose_1.Types.ObjectId();
        const user = yield models_1.default.User.create({
            name,
            email,
            password,
            phonenumber,
            userCollection: collectionId
        });
        yield models_1.default.Collection.create({ _id: collectionId });
        logger_1.default.info(`New user has been created with a given Id: '${user.id}'`);
        res.status(201).json((0, response_helpers_1.httpSuccess)(User_model_1.default.generateToken(user)));
    }));
};
const getAllEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginUser: user } = res.locals;
    const users = yield models_1.default.User.find({ _id: { $ne: user.id } });
    logger_1.default.info(`Return all users to admin with Id: '${user.id}'`);
    res.json((0, response_helpers_1.httpSuccess)(users));
});
const getEndpoint = (req, res) => {
    const { loginUser } = res.locals;
    logger_1.default.info(`Return profile info. Id: '${loginUser.id}'`);
    res.status(200).json((0, response_helpers_1.httpSuccess)(loginUser));
};
const getByIdEndpoint = (req, res) => {
    const { user } = res.locals;
    logger_1.default.info(`Return profile info. Id: '${user.id}'`);
    res.status(200).json((0, response_helpers_1.httpSuccess)(user));
};
const updateEndpoint = (req, res) => {
    const { name, email, phonenumber } = res.locals;
    const { loginUser: user } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield user.updateOne({
            name: name || user.name,
            email: email || user.email,
            phonenumber: phonenumber || user.phonenumber
        }, { runValidators: true });
        logger_1.default.info(`User with Id: '${user.id}' has been updated`);
        res.status(204).end();
    }));
};
const changePasswordEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = res.locals;
    const { loginUser: user } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield user.updateOne({ password });
        logger_1.default.info(`User with Id: '${user.id}' changed his password`);
        res.status(204).end();
    }));
});
const removeEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginUser: user } = res.locals;
    const collection = yield models_1.default.Collection.findById(user.userCollection);
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (collection === null || collection === void 0 ? void 0 : collection.deleteOne());
        yield user.deleteOne();
        logger_1.default.info(`User with Id: '${user.id}' has been removed`);
        res.status(204).end();
    }));
});
const updateByIdEndpoint = (req, res) => {
    const { name, email, phonenumber } = res.locals;
    const { loginUser, user } = res.locals;
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield user.updateOne({
            name: name || user.name,
            email: email || user.email,
            phonenumber: phonenumber || user.phonenumber
        }, { runValidators: true });
        logger_1.default.info(`User with Id: '${user.id}' has been updated by admin with Id: '${loginUser.id}'`);
        res.status(204).end();
    }));
};
const removeByIdEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginUser, user } = res.locals;
    const collection = yield models_1.default.Collection.findById(user.userCollection);
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield user.deleteOne();
        yield (collection === null || collection === void 0 ? void 0 : collection.deleteOne());
        logger_1.default.info(`User with Id: '${user.id}' has been removed by admin with Id: '${loginUser.id}'`);
        res.status(204).end();
    }));
});
const getMyQuestionsEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginUser: user } = res.locals;
    const questions = yield models_1.default.Question.find({ user: user.id }).select('-content');
    logger_1.default.info(`Return my-questions to user with Id: '${user.id}'`);
    res.json((0, response_helpers_1.httpSuccess)(questions));
});
const getCollectionEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginUser } = res.locals;
    const collection = yield models_1.default.Collection.findById(loginUser.userCollection)
        .populate({
        path: 'articles',
        populate: [
            { path: 'toolkit' },
            { path: 'section' }
        ]
    });
    logger_1.default.info(`Return collection to user with Id: '${loginUser.id}'`);
    res.status(200).json((0, response_helpers_1.httpSuccess)(collection));
});
const addToCollectionEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginUser: user, article } = res.locals;
    const collection = (yield models_1.default.Collection.findById(user.userCollection));
    // Check if exists
    if (collection.articles.indexOf(article.id) != -1) {
        logger_1.default.info(`User with Id: '${user.id}' tried to add existed article to collection`);
        return res.status(400)
            .json((0, response_helpers_1.httpError)("You already have this article in your collection"));
    }
    // Check for limit
    if (collection.articles.length > 10) {
        logger_1.default.info(`User with Id: '${user.id}' has reached his limit`);
        return res.status(400)
            .json((0, response_helpers_1.httpError)("You've reached you limit"));
    }
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        collection.articles = [...collection.articles, article.id];
        yield collection.save();
        logger_1.default.info(`User with Id: '${user.id}' added new article with Id: '${article.id}' to collection`);
        res.status(204).end();
    }));
});
const removeFromCollectionEndpoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { loginUser: user, article } = res.locals;
    const collection = yield models_1.default.Collection.findById(user === null || user === void 0 ? void 0 : user.userCollection);
    (0, controller_helpers_1.tryHandle)(res, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (collection === null || collection === void 0 ? void 0 : collection.updateOne({ $pull: { articles: article.id } }));
        logger_1.default.info(`User with Id: '${user.id}' removed article with Id: '${article.id}' from collection`);
        res.status(204).end();
    }));
});
const controller = {
    loginEndpoint,
    registerEndpoint,
    getAllEndpoint,
    getEndpoint,
    getByIdEndpoint,
    updateEndpoint,
    changePasswordEndpoint,
    removeEndpoint,
    updateByIdEndpoint,
    removeByIdEndpoint,
    getMyQuestionsEndpoint,
    getCollectionEndpoint,
    addToCollectionEndpoint,
    removeFromCollectionEndpoint
};
exports.default = controller;
