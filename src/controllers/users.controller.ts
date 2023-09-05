import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.config";
import { httpError, httpSuccess } from "../helpers/response.helpers";
import { Types } from "mongoose";
import db from "../models/models";
import { tryHandle } from "../helpers/controller.helpers";
import { UserDocument } from "../models/User.model";
import { ArticleDocument } from "../models/Article.model";

const loginEndpoint: RequestHandler = (req, res) => {
    const { user } = res.locals as { user: UserDocument };
    const { SECRET } = env;

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "3h"});

    res.status(200).json(httpSuccess({ token, privilege: user.privilege }));
};

const registerEndpoint: RequestHandler = (req, res) => {
    const { name, email, password } = res.locals;

    tryHandle(res, async () => {
        const collectionId = new Types.ObjectId();

        const user = await db.User.create({
            name, 
            email, 
            password,
            userCollection: collectionId
        });

        await db.Collection.create({ _id: collectionId });

        res.status(201).json(httpSuccess(user));
    });
};

const getEndpoint: RequestHandler = (req, res) => {
    const { loginUser } = res.locals as { loginUser: UserDocument };

    res.status(200).json(httpSuccess(loginUser));
};

const getByIdEndpoint: RequestHandler = (req, res) => {
    const { user } = res.locals as { user: UserDocument };

    res.status(200).json(httpSuccess(user));
};

const updateEndpoint: RequestHandler = (req, res) => {
    const { name, email } = res.locals;
    const { loginUser: user } = res.locals as { loginUser: UserDocument };

    tryHandle(res, async () => {
        db.User.updateOne()
        await user.updateOne({
            name: name || user.name,
            email: email || user.email,
        }, { runValidators: true });

        res.status(204).json();
    });
};

const removeEndpoint: RequestHandler = async (req, res) => {
    const { loginUser: user } = res.locals as { loginUser: UserDocument };

    const collection = await db.Collection.findById(user.userCollection);

    tryHandle(res, async () => {
        await user.deleteOne();
        await collection?.deleteOne();

        res.status(204).json();
    });
};

const updateByIdEndpoint: RequestHandler = (req, res) => {
    const { name, email } = res.locals;
    const { user } = res.locals as { user: UserDocument };

    tryHandle(res, async () => {
        db.User.updateOne()
        await user.updateOne({
            name: name || user.name,
            email: email || user.email,
        }, { runValidators: true });

        res.status(204).json();
    });
};

const removeByIdEndpoint: RequestHandler = async (req, res) => {
    const { user } = res.locals as { user: UserDocument };

    const collection = await db.Collection.findById(user.userCollection);

    tryHandle(res, async () => {
        await user.deleteOne();
        await collection?.deleteOne();

        res.status(204).json();
    });
};

const getCollectionEndpoint: RequestHandler = async (req, res) => {
    const { loginUser } = res.locals as { loginUser: UserDocument };

    const collection = await db.Collection.findById(loginUser.userCollection).populate("articles");

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
        res.status(400)
            .json(httpError("You already have this article in your collection"));
        return;
    }

    // Check for limit
    if (collection.articles.length > 10) {
        res.status(400)
            .json(httpError("You've reached you limit"));
        return;
    }

    tryHandle(res, async () => {
        collection.articles = [...collection.articles, article.id ];
        await collection.save();
        
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

        res.status(204).end();
    });
};

const controller = {
    loginEndpoint,
    registerEndpoint,
    getEndpoint,
    getByIdEndpoint,
    updateEndpoint,
    removeEndpoint,
    updateByIdEndpoint,
    removeByIdEndpoint,
    getCollectionEndpoint,
    addToCollectionEndpoint,
    removeFromCollectionEndpoint
};

export default controller;
