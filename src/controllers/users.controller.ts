import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.config";
import { httpError, httpSuccess } from "../helpers/response.helpers";
import { Types } from "mongoose";
import db from "../models";
import { tryHandle } from "../helpers/controller.helpers";
import UserModel, { UserDocument } from "../models/User.model";
import { ArticleDocument } from "../models/Article.model";
import IUsersController from "../interfaces/IUsersController";
import { ADMINS_LOGIN } from "../routes/user.routes";
import logger from "../libraries/logger";

const loginEndpoint: RequestHandler = (req, res) => {
    const { user } = res.locals as { user: UserDocument };

    if (req.route.path == ADMINS_LOGIN && user.privilege != "administrator") {
        logger.warn(`User with Id: '${user.id}' tried to login to the dashboard`);
        return res.status(401)
            .json(httpError("Only admins can login here"));
    }

    logger.info(`User with Id: '${user.id}' logged in`);
    res.status(200).json(httpSuccess(UserModel.generateToken(user)));
};

const registerEndpoint: RequestHandler = (req, res) => {
    const { name, email, password, phonenumber } = res.locals;

    tryHandle(res, async () => {
        const collectionId = new Types.ObjectId();

        const user = await db.User.create({
            name, 
            email, 
            password,
            phonenumber,
            userCollection: collectionId
        });

        await db.Collection.create({ _id: collectionId });

        logger.info(`New user has been created with a given Id: '${user.id}'`);
        res.status(201).json(httpSuccess(UserModel.generateToken(user)));
    });
};

const getAllEndpoint: RequestHandler = async (req, res) => {
    const { loginUser: user } = res.locals as { loginUser: UserDocument };

    const users = await db.User.find({ _id: { $ne: user.id }});

    logger.info(`Return all users to admin with Id: '${user.id}'`);
    res.json(httpSuccess(users));
};

const getEndpoint: RequestHandler = (req, res) => {
    const { loginUser } = res.locals as { loginUser: UserDocument };

    logger.info(`Return profile info. Id: '${loginUser.id}'`);
    res.status(200).json(httpSuccess(loginUser));
};

const getByIdEndpoint: RequestHandler = (req, res) => {
    const { user } = res.locals as { user: UserDocument };

    logger.info(`Return profile info. Id: '${user.id}'`);
    res.status(200).json(httpSuccess(user));
};

const updateEndpoint: RequestHandler = (req, res) => {
    const { name, email, phonenumber } = res.locals;
    const { loginUser: user } = res.locals as { loginUser: UserDocument };

    tryHandle(res, async () => {
        await user.updateOne({
            name: name || user.name,
            email: email || user.email,
            phonenumber: phonenumber || user.phonenumber
        }, { runValidators: true });

        logger.info(`User with Id: '${user.id}' has been updated`);
        res.status(204).end();
    });
};

const changePasswordEndpoint: RequestHandler = async (req, res) => {
    const { password } = res.locals;
    const { loginUser: user } = res.locals as { loginUser: UserDocument };

    tryHandle(res, async () => {
        await user.updateOne({ password });

        logger.info(`User with Id: '${user.id}' changed his password`);
        res.status(204).end();
    });
};

const removeEndpoint: RequestHandler = async (req, res) => {
    const { loginUser: user } = res.locals as { loginUser: UserDocument };

    const collection = await db.Collection.findById(user.userCollection);

    tryHandle(res, async () => {
        await collection?.deleteOne();
        await user.deleteOne();

        logger.info(`User with Id: '${user.id}' has been removed`);
        res.status(204).end();
    });
};

const updateByIdEndpoint: RequestHandler = (req, res) => {
    const { name, email, phonenumber } = res.locals;
    const { loginUser, user } = res.locals as { loginUser: UserDocument, user: UserDocument };

    tryHandle(res, async () => {
        await user.updateOne({
            name: name || user.name,
            email: email || user.email,
            phonenumber: phonenumber || user.phonenumber
        }, { runValidators: true });

        logger.info(`User with Id: '${user.id}' has been updated by admin with Id: '${loginUser.id}'`);
        res.status(204).end();
    });
};

const removeByIdEndpoint: RequestHandler = async (req, res) => {
    const { loginUser, user } = res.locals as { loginUser: UserDocument, user: UserDocument };

    const collection = await db.Collection.findById(user.userCollection);

    tryHandle(res, async () => {
        await user.deleteOne();
        await collection?.deleteOne();

        logger.info(`User with Id: '${user.id}' has been removed by admin with Id: '${loginUser.id}'`);
        res.status(204).end();
    });
};

const getMyQuestionsEndpoint: RequestHandler = async (req, res) => {
    const { loginUser: user } = res.locals as { loginUser: UserDocument };

    const questions = await db.Question.find({ user: user.id }).select('-content');

    logger.info(`Return my-questions to user with Id: '${user.id}'`);
    res.json(httpSuccess(questions));
};

const getCollectionEndpoint: RequestHandler = async (req, res) => {
    const { loginUser } = res.locals as { loginUser: UserDocument };

    const collection = await db.Collection.findById(loginUser.userCollection)
        .populate({
            path: 'articles',
            populate: [
            { path: 'toolkit' },
            { path: 'section' }
            ]
        });

    logger.info(`Return collection to user with Id: '${loginUser.id}'`);
    res.status(200).json(httpSuccess(collection));
};

const addToCollectionEndpoint: RequestHandler = async (req, res) => {
    const {
        loginUser: user,
        article
    } = res.locals as {
        loginUser: UserDocument,
        article: ArticleDocument
    };

    const collection = (await db.Collection.findById(user.userCollection))!;

    // Check if exists
    if (collection.articles.indexOf(article.id) != -1) {
        logger.info(`User with Id: '${user.id}' tried to add existed article to collection`);
        return res.status(400)
            .json(httpError("You already have this article in your collection"));
    }

    // Check for limit
    if (collection.articles.length > 10) {
        logger.info(`User with Id: '${user.id}' has reached his limit`);
        return res.status(400)
            .json(httpError("You've reached you limit"));
    }

    tryHandle(res, async () => {
        collection.articles = [...collection.articles, article.id ];
        await collection.save();
        
        logger.info(`User with Id: '${user.id}' added new article with Id: '${article.id}' to collection`);
        res.status(204).end();
    });
};

const removeFromCollectionEndpoint: RequestHandler = async (req, res) => {
    const {
        loginUser: user,
        article
    } = res.locals as {
        loginUser: UserDocument,
        article: ArticleDocument
    };

    const collection = await db.Collection.findById(user?.userCollection);

    tryHandle(res, async () => {
        await collection?.updateOne({ $pull: { articles: article.id }});

        logger.info(`User with Id: '${user.id}' removed article with Id: '${article.id}' from collection`);
        res.status(204).end();
    });
};

const controller: IUsersController = {
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

export default controller;
