import { RequestHandler } from "express";
import { ArticleDocument } from "../models/Article.model";
import { tryHandle } from "../helpers/controller.helpers";
import { Types } from "mongoose";
import db from "../models/models";
import { httpMongoError, httpSuccess } from "../helpers/response.helpers";
import { UserDocument } from "../models/User.model";
import { SectionDocument } from "../models/Section.model";
import ISectionsController from "../interfaces/ISectionsController";

const createEndpoint: RequestHandler = (req, res) => {
    const { loginUser } = res.locals as { loginUser: UserDocument };
    const { title, type, article: { articleTitle, description, content } } = res.locals;

    let newArticle: ArticleDocument | undefined = undefined;
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
    const { section } = res.locals as { section: SectionDocument };

    res.status(200).json(httpSuccess(section));
};

const updateEndpoint: RequestHandler = (req, res) => {
    const { title, type } = req.body;
    const { section } = res.locals as { section: SectionDocument };

    tryHandle(res, async () => {
        await section.updateOne({
            title: title || section.title,
            type: type || section.type
        });

        res.status(204).end();
    });
};

const removeEndpoint: RequestHandler = (req, res) => {
    const { section } = res.locals as { section: SectionDocument };

    tryHandle(res, async () => {
        await db.Article.deleteMany({ _id: { $in: section.articles }});

        await section.deleteOne();

        res.status(204).end();
    });
};

const addToEndpoint: RequestHandler = (req, res) => {
    const { title, description, content } = req.body;
    const { 
        section, 
        loginUser: user 
    } = res.locals as {
        section: SectionDocument,
        loginUser: UserDocument
    };

    tryHandle(res, async () => {
        const article = await db.Article.create({ 
            title, 
            type: section.type, 
            description, 
            content,
            creators: [ user.id ]
        });
        
        await section.updateOne({ articles: [...section.articles, article.id ]});

        res.status(201).json(httpSuccess(article));
    });
};

const controller: ISectionsController = {
    createEndpoint,
    getAllEndpoint,
    getByIdEndpoint,
    updateEndpoint,
    removeEndpoint,
    addToEndpoint,
};

export default controller;