import { Express } from "express";
import controller from "../controllers/questions.controller";
import middlewares, { Requires } from "../middlewares";
import auth from "../middlewares/auth.middlewares";
import questionMiddlewares from "../middlewares/question.middlewares";
import answerMiddlewares from "../middlewares/answer.middlewares";
import toolkitMiddlewares from "../middlewares/toolkit.middlewares";

export const GET_QUESTIONS = "/questions/toolkits/:id";
export const GET_QUESTION_BY_ID = "/questions/:id";
export const CREATE_QUESTION = "/questions/toolkits/:id";
export const UPDATE_QUESTION = "/questions/:id";
export const REMOVE_QUESTION = "/questions/:id";
export const VOTE_TO_QUESTION = "/questions/vote/:id";
export const UNVOTE_TO_QUESTION = "/questions/vote/:id";
export const OPEN_CLOSE_QUESTION = "/questions/open_close/:id";
export const ANSWER_QUESTION = "/questions/answer/:id";

const questionRoutes = (app: Express) => {
    app.get(GET_QUESTIONS, 
        [
            middlewares.checkId,
            toolkitMiddlewares.getToolkit
        ], controller.getAllEndpoint);

    app.get(GET_QUESTION_BY_ID, 
        [
            middlewares.checkId,
            questionMiddlewares.getQuestion
        ], controller.getByIdEndpoint);

    app.post(CREATE_QUESTION, 
        [
            auth.authenticate,
            middlewares.checkId,
            toolkitMiddlewares.getToolkit,
            questionMiddlewares.getBody(Requires.All).exec
        ], controller.createEndpoint);

    app.put(UPDATE_QUESTION, 
        [
            auth.authenticate,
            middlewares.checkId,
            questionMiddlewares.getQuestion,
            questionMiddlewares.canModify,
            questionMiddlewares.getBody(Requires.Partial).exec
        ], controller.updateEndpoint);

    app.delete(REMOVE_QUESTION, 
        [
            auth.authenticate,
            middlewares.checkId,
            questionMiddlewares.getQuestion,
            questionMiddlewares.canModify
        ], controller.removeEndpoint);

    app.post(VOTE_TO_QUESTION, 
        [
            auth.authenticate,
            questionMiddlewares.getVote,
            middlewares.checkId,
            questionMiddlewares.getQuestion
        ], controller.voteEndpoint);

    app.delete(UNVOTE_TO_QUESTION, 
        [
            auth.authenticate,
            middlewares.checkId,
            questionMiddlewares.getQuestion
        ], controller.unvoteEndpoint);

    app.put(OPEN_CLOSE_QUESTION, 
        [
            auth.authenticate,
            questionMiddlewares.getState,
            middlewares.checkId,
            questionMiddlewares.getQuestion,
            questionMiddlewares.canModify
        ], controller.openCloseEndpoint);

    app.post(ANSWER_QUESTION,
        [
            auth.authenticate,
            middlewares.checkId,
            answerMiddlewares.getBody,
            questionMiddlewares.getQuestion
        ], controller.answerEndpoint);
}

export default questionRoutes;