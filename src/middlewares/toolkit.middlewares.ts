import { RequestHandler } from "express";
import db from "../models/models";
import { httpError } from "../helpers/response.helpers";
import { CREATE_TOOLKIT } from "../routes/toolkit.routes";

const getBody: RequestHandler = (req, res, next) => {
    const { name, description, type, company } = req.body;

    switch(req.route.path) {
        case CREATE_TOOLKIT:
            if (!name || !description || !type || ! company) {
                return res.status(400)
                    .json(httpError("The 'name', 'description', 'type' and 'company' fields are required"));
            }
            break;
        default:
            if (!name && !description && !type && ! company) {
                return res.status(400)
                    .json(httpError("One of the following fields is required: 'name', 'description', 'type' and 'company'"));
            }
            break;
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

const getToolkit: RequestHandler = async (req, res, next) => {
    const { id } =  req.params;
    const toolkit = await db.Toolkit.findById(id);

    if (!toolkit) {
        return res.status(404)
            .json(httpError(`Toolkit with id: '${id}' is not found`));
    }

    res.locals.toolkit = toolkit;
    next();
}

const middlewares = {
    getBody,
    getToolkit
};

export default middlewares;