import { RequestHandler } from "express";
import IAnswersController from "../interfaces/IAnswersController";
import { tryHandle } from "../helpers/controller.helpers";
import { AnswerDocument } from "../models/Answer.model";
import { UserDocument } from "../models/User.model";
import db from "../models";
import logger from "../libraries/logger";

const updateEndpoint: RequestHandler = (req, res) => {
    const { answer } = res.locals as { answer: AnswerDocument };
    const { content } = res.locals;

    tryHandle(res, async () => {
        await answer.updateOne({ content }, { runValidators: true });

        logger.info(`Update answer with Id: '${answer.id}'`);
        res.status(204).end();
    });
};

const removeEndpoint: RequestHandler = async (req, res) => {
    const { answer } = res.locals as { answer: AnswerDocument };
    const question = await db.Question.findById(answer.question);

    tryHandle(res, async () => {
        await answer.deleteOne();

        question?.updateOne({ $pull: { answers: answer.id } });

        logger.info(`Remove answer with Id: '${answer.id}'`);
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
        const oldVote = await db.Vote.findOne({ on: answer.id });

        if (!oldVote) {
            const newVote = await db.Vote.create({
                on: answer.id,
                user: user.id,
                value: vote == "up" ? 1 : -1
            });

            await answer.updateOne({ $push: { votes: newVote.id } });
        } else {
            await oldVote.updateOne({ value: vote == "up" ? 1 : -1 });
        }

        logger.info(`User with Id: '${user.id}' voted to answer with Id: '${answer.id}'`);
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

        logger.info(`User with Id: '${user.id}' unvoted to answer with Id: '${answer.id}'`);
        res.status(204).end();
    });
};

const makeAsCorrectEndpoint: RequestHandler = (req, res) => {
    const { answer } = res.locals as { answer: AnswerDocument };

    tryHandle(res, async () => {
        await answer.updateOne({ isCorrect: true });

        logger.info(`Answer with Id: '${answer.id}' is marked as 'correct'`);
        res.status(204).end();
    });
};

const controller: IAnswersController = {
    updateEndpoint,
    removeEndpoint,
    voteEndpoint,
    unvoteEndpoint,
    makeAsCorrectEndpoint
};

export default controller;