import { RequestHandler } from "express";
import { ArticleDocument } from "../models/Article.model";
import { tryHandle } from "../helpers/controller.helpers";
import { Types } from "mongoose";
import db from "../models/models";
import { httpError, httpMongoError, httpSuccess } from "../helpers/response.helpers";
import { UserDocument } from "../models/User.model";
import { SectionDocument } from "../models/Section.model";
import ISectionsController from "../interfaces/ISectionsController";

const createEndpoint: RequestHandler = async (req, res) => {
    const { loginUser } = res.locals as { loginUser: UserDocument };
    const { title, type } = res.locals;
    const { toolkit: toolkitId } = req.body;

    if (!Types.ObjectId.isValid(toolkitId)) {
        return res.status(400)
            .json(httpError(`Id: '${toolkitId}' is not valid`));
    }

    const toolkit = await db.Toolkit.findById(toolkitId);

    if (!toolkit) {
        return res.status(404)
            .json(httpError(`Toolkit with id: '${toolkitId}' is not found`));
    }

    tryHandle(res, async () =>  {
        const section = await db.Section.create({
            toolkit: toolkitId,
            title, 
            type, 
            creator: loginUser.id
        });

        await toolkit.updateOne({ sections: [...toolkit.sections, section.id ]});

        res.status(201)
            .json(httpSuccess(section));
    });
};

const getAllEndpoint: RequestHandler = async (req, res) => {
    const { id: toolkitId } = req.params;
    const { type } = res.locals;

    const sections = await db.Section.find({ type, toolkit: toolkitId })
                                    .populate("articles", "title description");

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
            creators: [ user.id ],
            section: section.id,
            toolkit: section.toolkit
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