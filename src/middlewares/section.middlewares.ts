import { RequestHandler } from "express";
import db from "../models/models";
import { httpError } from "../helpers/response.helpers";

const getSection: RequestHandler = async (req, res, next) => {
    const { id } = req.params;

    const section = await db.Section.findById(id).populate("articles", "title description createdAt");

    if (!section) {
        return res.status(404)
            .json(httpError(`Section with Id: '${id}' is not found`));
    }

    res.locals.section = section;
    next();
};

const getBody: RequestHandler = (req, res, next) => {
    const { title, type } = req.body;
    
    if (!title || !type) {
        return res.status(400)
            .json(httpError(`The 'title' and 'type' fields are required`));
    }

    res.locals = {
        ...res.locals,
        title,
        type
    };

    next();
};

const checkSectionType: RequestHandler = (req, res, next) => {
    const { type } = req.query;

    if (!type || (type != "reference" && type != "tutorial")) {
        return res.status(400)
            .json(httpError("The 'type' query parameter should be either 'reference' or 'tutorial'"));
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
