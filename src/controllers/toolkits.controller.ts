import { RequestHandler } from "express";
import IToolkitsController from "../interfaces/IToolkitsController";
import db from "../models/models";
import { httpSuccess } from "../helpers/response.helpers";
import { tryHandle } from "../helpers/controller.helpers";
import { ToolkitDocument } from "../models/Toolkit.model";
import { UserDocument } from "../models/User.model";

const createEndpoint: RequestHandler = (req, res) => {
    const { loginUser: user } = res.locals as { loginUser: UserDocument };
    const { name, description, type, company } = res.locals;

    tryHandle(res, async () => {
        const toolkit = await db.Toolkit.create({
            name,
            description,
            type,
            company,
            createdBy: user.id
        });

        res.status(201).json(httpSuccess(toolkit));
    });
};

const getAllEndpoint: RequestHandler = async (req, res) => {
    const toolkits = await db.Toolkit.find();
    // TODO include top 5

    res.json(httpSuccess(toolkits));
};

const getByIdEndpoint: RequestHandler = (req, res) => {
    const { toolkit } = res.locals;

    res.json(httpSuccess(toolkit));
};
    
const updateEndpoint: RequestHandler = (req, res) => {
    const { toolkit } = res.locals as { toolkit: ToolkitDocument };
    const { name, description, type, company } = res.locals;

    tryHandle(res, async () => {
        await toolkit.updateOne({
            name: name ?? toolkit.name,
            description: description ?? toolkit.description,
            type: type ?? toolkit.type,
            company: company ?? toolkit.company
        });

        res.status(204).end();
    });
};
    
const removeEndpoint: RequestHandler = (req, res) => {
    const { toolkit } = res.locals as { toolkit: ToolkitDocument };

    tryHandle(res, async () => {
        await toolkit.deleteOne();

        res.status(204).end();
    });
};

const controller: IToolkitsController = {
    createEndpoint,
    getAllEndpoint,
    getByIdEndpoint,
    updateEndpoint,
    removeEndpoint,
};

export default controller;