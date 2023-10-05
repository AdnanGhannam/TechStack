import { RequestHandler } from "express";
import IQuestionsController from "../interfaces/IQuestionsController";
import db from "../models";
import { httpSuccess } from "../helpers/response.helpers";
import { tryHandle } from "../helpers/controller.helpers";
import { UserDocument } from "../models/User.model";
import { QuestionDocument } from "../models/Question.model";
import { ToolkitDocument } from "../models/Toolkit.model";
import logger from "../libraries/logger";

const getAllEndpoint: RequestHandler = async (req, res) => {
    const { toolkit } = res.locals as { toolkit: ToolkitDocument };

    const questions = await db.Question.find({ toolkit: toolkit.id }).populate("user");

    logger.info(`Return all questions`);
    res.json(httpSuccess(questions));
};

const getByIdEndpoint: RequestHandler = async (req, res) => {
    const { question } = res.locals;

    await question.updateOne({ $inc: { views: 1 }});

    logger.info(`Return question with Id: '${question.id}'`);
    res.json(httpSuccess(question));
};

const getPopulareEndpoint: RequestHandler = async (req, res) => {
    const top = await db.Question.find().sort("-views").limit(5).select("title");

    logger.info(`Return top 5 questions`);
    res.json(httpSuccess(top));
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

        logger.info(`Add new question with Id: '${question.id}' to toolkit with Id: '${toolkit.id}' by user with Id: '${user.id}'`);
        res.status(201).json(httpSuccess(question));
    });
};

const updateEndpoint: RequestHandler = (req, res) => {
    const { title, content } = res.locals;
    const { question, loginUser: user } = res.locals as { 
        question: QuestionDocument,
        loginUser: UserDocument
    };

    tryHandle(res, async () => {
        await question.updateOne({
            title: title ?? question.title,
            content: content ?? question.content
        }, { runValidators: true });

        logger.info(`Update question with Id: '${question.id}' by user with Id: '${user.id}'`);
        res.status(204).end();
    });
};

const removeEndpoint: RequestHandler = async (req, res) => {
    const { question, loginUser: user } = res.locals as { 
        question: QuestionDocument,
        loginUser: UserDocument
    };
    const toolkit = await db.Toolkit.findById(question.toolkit);

    tryHandle(res, async () => {
        await question.deleteOne();
        await db.Answer.deleteMany({ question: question.id });

        await toolkit?.updateOne({ $pull: { questions: question.id } });

        logger.info(`Remove question with Id: '${question.id}' by user with Id: '${user.id}'`);
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
        const oldVote = await db.Vote.findOne({ on: question.id });

        if (!oldVote) {
            const newVote = await db.Vote.create({
                on: question.id,
                user: user.id,
                value: vote == "up" ? 1 : -1
            });

            await question.updateOne({ $push: { votes: newVote.id } });
        } else {
            await oldVote.updateOne({ value: vote == "up" ? 1 : -1 });
        }

        logger.info(`User with Id: '${user.id}' voted to question with Id: '${question.id}'`);
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

        logger.info(`User with Id: '${user.id}' unvoted to question with Id: '${question.id}'`);
        res.status(204).end();
    });
};

const openCloseEndpoint: RequestHandler = (req, res) => {
    const { state } = req.query;
    const { question, loginUser: user } = res.locals as {
        question: QuestionDocument,
        loginUser: UserDocument
    };

    tryHandle(res, async () => {
        await question.updateOne({ isOpen: state == "true" });
        
        logger.info(`User with Id: '${user.id}' updated state of question with Id: '${question.id}'`);
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

        logger.info(`User with Id: '${user.id}' answered question with Id: '${question.id}'`);
        res.status(201).json(httpSuccess(answer));
    });
};

const controller: IQuestionsController = {
    getAllEndpoint,
    getByIdEndpoint,
    getPopulareEndpoint,
    createEndpoint,
    updateEndpoint,
    removeEndpoint,
    voteEndpoint,
    unvoteEndpoint,
    openCloseEndpoint,
    answerEndpoint
};

export default controller;