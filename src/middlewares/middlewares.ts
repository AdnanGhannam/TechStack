import cors from "cors";
import express, { Express, RequestHandler } from "express";
import { Types } from "mongoose";
import { httpError } from "../helpers/response.helpers";

const config = (app: Express) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
};

const checkId: RequestHandler = (req, res, next) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400)
            .json(httpError(`Id: '${id}' is not valid`));
    }

    next();
}

const middlewares = { 
    config,
    checkId
};

export default middlewares;