import { RequestHandler } from "express";
import { tryHandle } from "../helpers/controller.helpers";
import db from "../models";
import { httpError, httpMongoError, httpSuccess } from "../helpers/response.helpers";
import { UserDocument } from "../models/User.model";
import { SectionDocument } from "../models/Section.model";
import ISectionsController from "../interfaces/ISectionsController";
import logger from "../libraries/logger";

const getAllEndpoint: RequestHandler = async (req, res) => {
    const toolkits = await db.Toolkit.find({ }).populate({
        path: "sections",
        populate: "creator"
    });

    const sections: SectionDocument[] & any[] = [];

    toolkits.forEach(toolkit => {
        toolkit.toObject().sections.forEach((section, index) => {
            sections.push({
                ...section, 
                toolkit: {
                    _id: toolkit.id,
                    name: toolkit.name
                }, 
                order: index
            });
        });
    });

    logger.info(`Return all sections`);
    res.json(httpSuccess(sections));
};

const getByIdEndpoint: RequestHandler = (req, res) => {
    const { section } = res.locals as { section: SectionDocument };

    logger.info(`Return section with Id: '${section.id}'`);
    res.status(200).json(httpSuccess(section));
};

const updateEndpoint: RequestHandler = (req, res) => {
    const { title, type } = res.locals;
    const { section, loginUser: user } = res.locals as { 
        section: SectionDocument,
        loginUser: UserDocument
    };

    tryHandle(res, async () => {
        await section.updateOne({
            title: title || section.title,
            type: type || section.type
        });

        logger.info(`Update section with Id: '${section.id}' by admin with Id: '${user.id}'`);
        res.status(204).end();
    });
};

const removeEndpoint: RequestHandler = (req, res) => {
    const { section, loginUser: user } = res.locals as { 
        section: SectionDocument,
        loginUser: UserDocument
    };

    tryHandle(res, async () => {
        await section.deleteOne();
        await db.Toolkit.findByIdAndUpdate(section.id, { $pull: { sections: section.id } });
        await db.Article.deleteMany({ _id: { $in: section.articles }});

        logger.info(`Remove section with Id: '${section.id}' by admin with Id: '${user.id}'`);
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
        
        if (order != '' && order >= 0) {
            await section.updateOne({ 
                $push: {
                    articles: {
                        $each: [article],
                        $position: order
                    }
                }
            });
        } else {
            await section.updateOne({ $push: { articles: article }});
        }

        logger.info(`Add new article with Id: '${article.id}', to section with Id: '${section.id}' by admin with Id: '${user.id}'`);
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