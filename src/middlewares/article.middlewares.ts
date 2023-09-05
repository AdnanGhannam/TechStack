import { RequestHandler } from "express";
import db from "../models/models";
import { httpError } from "../helpers/response.helpers";

const getArticle: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    const article = await db.Article.findById(id).populate("reactions");

    if (!article) {
        res.status(404)
            .json(httpError(`Article with Id: '${id}' is not found`));
        return;
    }

    res.locals.article = article;
    next();
}

const getBody: RequestHandler = (req, res, next) => {
    const { title, description, content } = req.body;

    if (!title && !description && !content) {
        res.status(400)
            .json(httpError("One of the following fields is required 'title', 'description' and 'content'"));
        return;
    }

    res.locals = {
        ...res.locals,
        title,
        description,
        content
    };

    next();
};

const getReactionType: RequestHandler = (req, res, next) => {
    const { type } = req.query;

    if (!type || (type != "like" && type != "dislike")) {
        res.status(400)
            .json(httpError("The 'type' query parameter should be either 'like' or 'dislike'"));
        return;
    }

    res.locals.type = type;
    next();
};

const middlewares = {
    getArticle,
    getBody,
    getReactionType
};

export default middlewares;