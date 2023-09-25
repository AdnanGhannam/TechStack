import { RequestHandler } from "express";
import { tryHandle } from "../helpers/controller.helpers";
import db from "../models";
import { httpError, httpMongoError, httpSuccess } from "../helpers/response.helpers";
import { UserDocument } from "../models/User.model";
import { SectionDocument } from "../models/Section.model";
import ISectionsController from "../interfaces/ISectionsController";

const getAllEndpoint: RequestHandler = async (req, res) => {
    
};

const getByIdEndpoint: RequestHandler = (req, res) => {
    const { section } = res.locals as { section: SectionDocument };

    res.status(200).json(httpSuccess(section));
};

const updateEndpoint: RequestHandler = (req, res) => {
    const { title, type } = res.locals;
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
    const { title, description, content, order } = res.locals;
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
        
        await section.updateOne({ 
            $push: {
                articles: {
                    $each: [article],
                    $position: order
                }
            }
        });

        res.status(201).json(httpSuccess(article));
    });
};

const controller: ISectionsController = {
    getAllEndpoint,
    getByIdEndpoint,
    updateEndpoint,
    removeEndpoint,
    addToEndpoint,
};

export default controller;