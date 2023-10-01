import { RequestHandler } from "express";
import db from "../models";
import { httpError } from "../helpers/response.helpers";
import { SECTION_TYPES } from "../models/Section.model";
import { Requires } from ".";

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

const getBody = (requires: Requires) => {
    const exec: RequestHandler = (req, res, next) => {
        const { title, type, order } = req.body;

        if (requires == Requires.All && (!title || !type)) {
            return res.status(400)
                .json(httpError("The 'title' and 'type' fields are required"));
        }

        if (requires == Requires.Partial && !title && !type && order == null) {
            return res.status(400)
                .json(httpError(`One of the following fields is required: 'title', 'type' and 'order'`));
        }

        res.locals = {
            ...res.locals,
            title,
            type,
            order
        };

        next();
    }

    return { exec };
}


const checkSectionType: RequestHandler = (req, res, next) => {
    const type = res.locals.type || req.query.type;

    if (!type || !SECTION_TYPES.includes(`${type}`)) {
        return res.status(400)
            .json(httpError("The 'type' should be either 'reference' or 'tutorial'"));
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
