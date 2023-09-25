import { RequestHandler } from "express";
import db from "../models";
import { httpError } from "../helpers/response.helpers";
import { Requires } from ".";

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

const getBody = (requires: Requires) => {
    const exec: RequestHandler = (req, res, next) => {
        const { title, description, content, order } = req.body;

        if (requires == Requires.All && (!title || !description || !content || order == null)) {
            return res.status(400)
                .json(httpError("The 'title', 'description', 'content' and 'order' fields are required"));
        }

        if (requires == Requires.Partial && !title && !description && !content && order == null) {
            return res.status(400)
                .json(httpError(`One of the following fields is required: 'title', 'description', 'content' and 'order'`));
        }

        res.locals = {
            ...res.locals,
            title,
            description,
            content,
            order
        };

        next();
    }

    return { exec };
}

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