import { RequestHandler } from "express";
import { TArticle } from "../models/Article.model";
import { tryHandle } from "../helpers/controller.helpers";
import { Document, Model, Types } from "mongoose";
import db from "../models/models";
import { httpMongoError, httpSuccess } from "../helpers/response.helpers";

const createEndpoint: RequestHandler = (req, res) => {
    const { loginUser } = res.locals;
    const { title, type, article: { articleTitle, description, content } } = res.locals;

    let newArticle: Document<unknown, {}, TArticle> | undefined = undefined;
    tryHandle(res, async () =>  {
        const articleId = new Types.ObjectId();

        const newSection = await db.Section.create({
            title, 
            type, 
            creator: 
            loginUser.id, 
            articles: [articleId] 
        });

        newArticle = await db.Article.create({
            _id: articleId, 
            title: articleTitle, 
            type, 
            description, 
            content, 
            section: newSection.id,
            creators: [loginUser.id]
        });

        res.status(201)
            .json(httpSuccess(newSection));
    }, async (err) => {
        await newArticle?.deleteOne();

        res.status(400).json(httpMongoError(err));
    });
};

const getAllEndpoint: RequestHandler = async (req, res) => {
    const { type } = res.locals;
    const sections = await db.Section.find({ type }).populate("articles", "title description");

    res.status(200)
        .json(httpSuccess(sections));
};

const getByIdEndpoint: RequestHandler = (req, res) => {
    const { section } = res.locals;

    res.status(200).json(httpSuccess(section));
};

const updateEndpoint: RequestHandler = (req, res) => {
    const { title, type } = req.body;
    const { section } = res.locals;

    tryHandle(res, async () => {
        await section.updateOne({
            title: title || section.title,
            type: type || section.type
        });

        res.status(204).end();
    });
};

const removeEndpoint: RequestHandler = (req, res) => {
    const { section } = res.locals;

    tryHandle(res, async () => {
        await db.Article.deleteMany({ _id: { $in: section.children }});

        await section.deleteOne();

        res.status(204).end();
    });
};

const addToEndpoint: RequestHandler = (req, res) => {
    const { title, description, content } = req.body;
    const { section, loginUser: user } = res.locals;

    tryHandle(res, async () => {
        const article = await db.Article.create({ 
            title, 
            type: section.type, 
            description, 
            content,
            creators: [ user.id ]
        });
        
        await section.updateOne({ children: [...section.articles, article.id ]});

        res.status(201).json(httpSuccess(article));
    });
};

const controller = {
    createEndpoint,
    getAllEndpoint,
    getByIdEndpoint,
    updateEndpoint,
    removeEndpoint,
    addToEndpoint,
};

export default controller;