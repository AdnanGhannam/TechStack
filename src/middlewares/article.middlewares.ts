import { RequestHandler } from "express";
import db from "../models/models";
import { httpError } from "../helpers/response.helpers";

const getArticle: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    const article = await db.Article.findById(id).populate("reactions creators");

    if (!article) {
        return res.status(404)
            .json(httpError(`Article with Id: '${id}' is not found`));
    }

    res.locals.article = article;
    next();
}

const getBody: RequestHandler = (req, res, next) => {
    const { title, description, content } = req.body;

    if (!title && !description && !content) {
        return res.status(400)
            .json(httpError("One of the following fields is required 'title', 'description' and 'content'"));
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
        return res.status(400)
            .json(httpError("The 'type' query parameter should be either 'like' or 'dislike'"));
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