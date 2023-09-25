import { RequestHandler } from "express";
import IAnswersController from "../interfaces/IAnswersController";
import { tryHandle } from "../helpers/controller.helpers";
import { AnswerDocument } from "../models/Answer.model";
import { UserDocument } from "../models/User.model";
import db from "../models";

const createEndpoint: RequestHandler = (req, res) => {
};

const updateEndpoint: RequestHandler = (req, res) => {
    const { answer } = res.locals as { answer: AnswerDocument };
    const { content } = res.locals;

    tryHandle(res, async () => {
        await answer.updateOne({ content });

        res.status(204).end();
    });
};

const removeEndpoint: RequestHandler = (req, res) => {
    const { answer } = res.locals as { answer: AnswerDocument };

    tryHandle(res, async () => {
        await answer.deleteOne();

        res.status(204).end();
    });
};

const voteEndpoint: RequestHandler = (req, res) => {
    const { vote } = req.query;
    const { loginUser: user, answer } = res.locals as {
        loginUser: UserDocument,
        answer: AnswerDocument
    };

    tryHandle(res, async () => {
        const newVote = await db.Vote.create({
            user: user.id,
            value: vote == "up" ? 1 : -1
        });

        await answer.updateOne({ $push: { votes: newVote.id } });

        res.status(204).end();
    });
};

const unvoteEndpoint: RequestHandler = (req, res) => {
    const { loginUser: user, answer } = res.locals as {
        loginUser: UserDocument,
        answer: AnswerDocument
    };

    tryHandle(res, async () => {
        const vote = await db.Vote.findOneAndDelete({ user: user.id });

        await answer.updateOne({ $pull: { votes: vote?.id } });

        res.status(204).end();
    });
};

const makeAsCorrectEndpoint: RequestHandler = (req, res) => {
    const { answer } = res.locals as { answer: AnswerDocument };

    tryHandle(res, async () => {
        await answer.updateOne({ isCorrect: true });

        res.status(204).end();
    });
};

const controller: IAnswersController = {
    createEndpoint,
    updateEndpoint,
    removeEndpoint,
    voteEndpoint,
    unvoteEndpoint,
    makeAsCorrectEndpoint
};

export default controller;