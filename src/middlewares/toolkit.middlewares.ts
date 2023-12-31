import { RequestHandler } from "express";
import db from "../models";
import { httpError } from "../helpers/response.helpers";
import { CREATE_TOOLKIT } from "../routes/toolkit.routes";
import { Requires } from ".";
import logger from "../libraries/logger";

const getBody = (requires: Requires) => {
    const exec: RequestHandler = (req, res, next) => {
        const { name, description, type, company } = req.body;

        if (requires == Requires.All && (!name || !description || !type || !company)) {
            return res.status(400)
                .json(httpError("The 'name', 'description', 'type' and 'company' fields are required"));
        }

        if (requires == Requires.Partial && !name && !description && !type && !company) {
            return res.status(400)
                .json(httpError("One of the following fields is required: 'name', 'description', 'type' and 'company'"));
        }

        res.locals = {
            ...res.locals,
            name,
            description,
            type,
            company
        }

        next();
    }

    return { exec };
}

const getToolkit: RequestHandler = async (req, res, next) => {
    const { id } =  req.params;
    const toolkit = await db.Toolkit.findById(id).populate("creator");

    if (!toolkit) {
        const message = `Toolkit with id: '${id}' is not found`;
        logger.error(message);
        return res.status(404)
            .json(httpError(message));
    }

    res.locals.toolkit = toolkit;
    next();
}

const middlewares = {
    getBody,
    getToolkit
};

export default middlewares;