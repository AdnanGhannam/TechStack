import { RequestHandler } from "express";
import { httpError } from "../helpers/response.helpers";
import db from "../models";
import { AnswerDocument } from "../models/Answer.model";
import { UserDocument } from "../models/User.model";

const getAnswer: RequestHandler = async (req, res, next) => {
    const { id } = req.params;

    const answer = await db.Answer.findById(id);

    if (!answer) {
        return res.status(404)
            .json(httpError(`Answer with Id: '${id}' is not found`));
    }

    res.locals.answer = answer;

    next();
};

const getBody: RequestHandler = (req, res, next) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400)
            .json(httpError(`The 'content' field is required`));
    }

    res.locals.content = content;

    next();
};

const canModify: RequestHandler = (req, res, next) => {
    const { loginUser: user, answer } = res.locals as {
        loginUser: UserDocument,
        answer: AnswerDocument
    };

    if (answer.user != user && user.privilege != "administrator") {
        return res.status(401)
            .json(httpError("You don't have privilege to make this action"));
    }

    next();
};

const middlewares = {
    getAnswer,
    getBody,
    canModify
};

export default middlewares;