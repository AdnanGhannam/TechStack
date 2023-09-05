import { RequestHandler } from "express";
import db from "../models/models";
import { httpError } from "../helpers/response.helpers";

const getSection: RequestHandler = async (req, res, next) => {
    const { id } = req.params;

    const section = await db.Section.findById(id).populate("articles", "title description createdAt");

    if (!section) {
        res.status(404)
            .json(httpError(`Section with Id: '${id}' is not found`));
        return;
    }

    res.locals.section = section;
    next();
};

const getBody: RequestHandler = (req, res, next) => {
    const { title, type, article: { title: articleTitle = "", description = "", content = "" } = {} } 
        = req.body;
    
    if (!title || !type || !articleTitle || !description || !content) {
        res.status(400)
            .json(httpError(`The following fields are required: 'title', 'type', 'article.title', 'article.description' and 'article.content'`));
        return;
    }

    res.locals.title = title;
    res.locals.type = type;
    res.locals.article = { articleTitle, description, content };
    next();
};

const checkSectionType: RequestHandler = (req, res, next) => {
    const { type } = req.query;

    if (!type || (type != "reference" && type != "tutorial")) {
        res.status(400)
            .json(httpError("The 'type' query parameter should be either 'reference' or 'tutorial'"));
        return;
    }

    res.locals.type = type;
    next();
};

const middlewares = {
    getSection,
    getBody,
    checkSectionType
};

export default middlewares;
