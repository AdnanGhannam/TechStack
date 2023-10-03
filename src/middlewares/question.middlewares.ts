import { RequestHandler } from "express";
import db from "../models";
import { httpError } from "../helpers/response.helpers";
import { Requires } from ".";
import { UserDocument } from "../models/User.model";
import { QuestionDocument } from "../models/Question.model";

const getQuestion: RequestHandler = async (req, res, next) => {
    const { id } = req.params;

    const question = await db.Question.findById(id)
        .populate("user")
        .populate("votes")
        .populate({
            path: "answers",
            populate: { path: "user votes" }
        });

    if (!question) {
        return res.status(404)
            .json(httpError(`Question with Id: '${id}' is not found`));
    }

    res.locals.question = question;
    next();
};

const getBody = (requires: Requires) => {
    const exec: RequestHandler = (req, res, next) => {
        const { title, content } = req.body;

        if (requires == Requires.All && (!title || !content)) {
            return res.status(400)
                .json(httpError("The 'title' and 'content' fields are required"));
        }

        if (requires == Requires.Partial && !title && !content) {
            return res.status(400)
                .json(httpError(`One of the following fields is required: 'title' and 'content'`));
        }

        res.locals = {
            ...res.locals,
            title,
            content
        };

        next();
    };

    return { exec };
};

const canModify: RequestHandler = (req, res, next) => {
    const { loginUser: user, question } = res.locals as {
        loginUser: UserDocument,
        question: QuestionDocument
    };

    console.log()
    if ((<UserDocument>question.user).id != user.id && user.privilege != "administrator") {
        return res.status(401)
            .json(httpError("You don't have privilege to make this action"));
    }

    next();
};

const getVote: RequestHandler = (req, res, next) => {
    const { vote } = req.query;

    if (!vote || (vote != "up" && vote != "down")) {
        return res.status(400)
            .json(`The 'vote' query should be either 'up' or 'down'`);
    }

    next();
};

const getState: RequestHandler = (req, res, next) => {
    const { state } = req.query;

    if (!state || (state != "true" && state != "false")) {
        return res.status(400)
            .json(`The 'state' query should be either 'true' or 'false'`);
    }

    next();
};

const middlewares = {
    getQuestion,
    getBody,
    canModify,
    getVote,
    getState
};

export default middlewares;