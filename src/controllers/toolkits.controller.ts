import { RequestHandler } from "express";
import IToolkitsController from "../interfaces/IToolkitsController";
import db from "../models";
import { httpSuccess } from "../helpers/response.helpers";
import { tryHandle } from "../helpers/controller.helpers";
import ToolkitModel, { ToolkitDocument } from "../models/Toolkit.model";
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
            creator: user.id
        });

        res.status(201).json(httpSuccess(toolkit));
    });
};

const getAllEndpoint: RequestHandler = async (req, res) => {
    const { include } = req.query;


    let toolkits = db.Toolkit.find().populate("creator");

    if (include == "true") {
        toolkits = toolkits.populate({
            path: "sections",
            options: { limit: 8 },
            select: "title type"
        });
    }

    res.json(httpSuccess(await toolkits));
};

const getByIdEndpoint: RequestHandler = async (req, res) => {
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
        await db.Section.deleteMany({ toolkit: toolkit.id });
        await db.Article.deleteMany({ toolkit: toolkit.id });
        await db.Question.deleteMany({ toolkit: toolkit.id });

        res.status(204).end();
    });
};

const addToEndpoint: RequestHandler = (req, res) => {
    const { loginUser, toolkit } = res.locals as { loginUser: UserDocument, toolkit: ToolkitDocument };
    const { title, type, order } = res.locals;

    tryHandle(res, async () =>  {
        const section = await db.Section.create({
            toolkit: toolkit.id,
            title, 
            type, 
            creator: loginUser.id,
        });

        if (order != '' && order >= 0) {
            await toolkit.updateOne( {
                $push: {
                    sections: {
                        $each: [section],
                        $position: order
                    }
                }
            });
        } else {
            await toolkit.updateOne({ $push: { sections: section }});
        }

        res.status(201)
            .json(httpSuccess(section));
    });
};

const getAllSectionsInEndpoint: RequestHandler = async (req, res) => {
    const { id: toolkitId } = req.params;
    const { type } = res.locals;

    const sections = await db.Section.find({ type, toolkit: toolkitId })
                                    .populate("articles", "title description");

    res.status(200)
        .json(httpSuccess(sections));
};

const controller: IToolkitsController = {
    createEndpoint,
    getAllEndpoint,
    getByIdEndpoint,
    updateEndpoint,
    removeEndpoint,
    addToEndpoint,
    getAllSectionsInEndpoint
};

export default controller;