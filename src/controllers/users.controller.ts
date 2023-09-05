import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.config";
import { httpError, httpSuccess } from "../helpers/response.helpers";
import { Types } from "mongoose";
import db from "../models/models";
import { tryHandle } from "../helpers/controller.helpers";

const loginEndpoint: RequestHandler = (req, res) => {
    const { user } = res.locals;
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
    const { loginUser } = res.locals;

    res.status(200).json(httpSuccess(loginUser));
};

const getByIdEndpoint: RequestHandler = (req, res) => {
    const { user } = res.locals;

    res.status(200).json(httpSuccess(user));
};

const updateEndpoint: RequestHandler = (req, res) => {
    const { loginUser: user, name, email } = res.locals;

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
    const { loginUser: user } = res.locals;
    const collection = await db.Collection.findById(user.userCollection);

    tryHandle(res, async () => {
        await user.deleteOne();
        await collection?.deleteOne();

        res.status(204).json();
    });
};

const updateByIdEndpoint: RequestHandler = (req, res) => {
    const { user, name, email } = res.locals;

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
    const { user } = res.locals;
    const collection = await db.Collection.findById(user.userCollection);

    tryHandle(res, async () => {
        await user.deleteOne();
        await collection?.deleteOne();

        res.status(204).json();
    });
};

const getCollectionEndpoint: RequestHandler = async (req, res) => {
    const { loginUser } = res.locals;

    const collection = await db.Collection.findById(loginUser.userCollection).populate("articles");

    res.status(200).json(httpSuccess(collection));
};

const addToCollectionEndpoint: RequestHandler = async (req, res) => {
    const { loginUser: user, article } = res.locals;

    const collection = (await db.Collection.findById(user.userCollection))!;

    // Check if exists
    if (collection.articles.indexOf(article.id) != -1) {
        res.status(400)
            .json(httpError("You already have this post in your collection"));
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
    const { loginUser: user, post } = res.locals;
    const collection = await db.Collection.findById(user?.userCollection);

    tryHandle(res, async () => {
        await collection?.updateOne({ $pull: { posts: post.id }});
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
