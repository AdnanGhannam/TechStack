import { RequestHandler } from "express";
import IQuestionsController from "../interfaces/IQuestionsController";
import db from "../models";
import { httpSuccess } from "../helpers/response.helpers";
import { tryHandle } from "../helpers/controller.helpers";
import { UserDocument } from "../models/User.model";
import { QuestionDocument } from "../models/Question.model";
import { ToolkitDocument } from "../models/Toolkit.model";

const getAllEndpoint: RequestHandler = async (req, res) => {
    const { toolkit } = res.locals as { toolkit: ToolkitDocument };

    const questions = await db.Question.find({ toolkit: toolkit.id }).populate("user");

    res.json(httpSuccess(questions));
};

const getByIdEndpoint: RequestHandler = async (req, res) => {
    const { question } = res.locals;

    await question.updateOne({ $inc: { views: 1 }});

    res.json(httpSuccess(question));
};

const createEndpoint: RequestHandler = (req, res) => {
    const { title, content } = res.locals;
    const {loginUser: user, toolkit } = res.locals as {
        loginUser: UserDocument,
        toolkit: ToolkitDocument
    };

    tryHandle(res, async () => {
        const question = await db.Question.create({ title, content, user: user.id, toolkit: toolkit.id });

        await toolkit.updateOne({ $push: { questions: question.id } });

        res.status(201).json(httpSuccess(question));
    });
};

const updateEndpoint: RequestHandler = (req, res) => {
    const { title, content } = res.locals;
    const { question } = res.locals as { question: QuestionDocument };

    tryHandle(res, async () => {
        await question.updateOne({
            title: title ?? question.title,
            content: content ?? question.content
        }, { runValidators: true });

        res.status(204).end();
    });
};

const removeEndpoint: RequestHandler = async (req, res) => {
    const { question } = res.locals as { question: QuestionDocument };
    const toolkit = await db.Toolkit.findById(question.toolkit);

    tryHandle(res, async () => {
        await question.deleteOne();

        await toolkit?.updateOne({ $pull: { questions: question.id } });

        res.status(204).end();
    });
};

const voteEndpoint: RequestHandler = (req, res) => {
    const { vote } = req.query;
    const { loginUser: user, question } = res.locals as {
        loginUser: UserDocument,
        question: QuestionDocument
    };

    tryHandle(res, async () => {
        const newVote = await db.Vote.create({
            user: user.id,
            value: vote == "up" ? 1 : -1
        });

        await question.updateOne({ $push: { votes: newVote.id } });

        res.status(204).end();
    });
};

const unvoteEndpoint: RequestHandler = (req, res) => {
    const { loginUser: user, question } = res.locals as {
        loginUser: UserDocument,
        question: QuestionDocument
    };

    tryHandle(res, async () => {
        const vote = await db.Vote.findOneAndDelete({ user: user.id });

        await question.updateOne({ $pull: { votes: vote?.id } });

        res.status(204).end();
    });
};

const openCloseEndpoint: RequestHandler = (req, res) => {
    const { state } = req.query;
    const { question } = res.locals as { question: QuestionDocument };

    tryHandle(res, async () => {
        await question.updateOne({ isOpen: state == "true" });
        
        res.status(204).end();
    });
};

const answerEndpoint: RequestHandler = (req, res) => {
    const { content } = res.locals;
    const { loginUser: user, question } = res.locals as {
        loginUser: UserDocument,
        question: QuestionDocument
    };

    tryHandle(res, async () => {
        const answer = await db.Answer.create({
            user: user.id,
            content
        });

        await question.updateOne({ $push: { answers: answer.id } });

        res.status(201).json(httpSuccess(answer));
    });
};

const controller: IQuestionsController = {
    getAllEndpoint,
    getByIdEndpoint,
    createEndpoint,
    updateEndpoint,
    removeEndpoint,
    voteEndpoint,
    unvoteEndpoint,
    openCloseEndpoint,
    answerEndpoint
};

export default controller;