import { Express } from "express";
import controller from "../controllers/questions.controller";
import middlewares, { Requires } from "../middlewares";
import auth from "../middlewares/auth.middlewares";
import questionMiddlewares from "../middlewares/question.middlewares";

export const GET_QUESTIONS = "/questions";
export const GET_QUESTION_BY_ID = "/questions/:id";
export const CREATE_QUESTION = "/questions";
export const UPDATE_QUESTION = "/questions/:id";
export const REMOVE_QUESTION = "/questions/:id";
export const VOTE_TO_QUESTION = "/questions/vote/:id";
export const UNVOTE_TO_QUESTION = "/questions/vote/:id";
export const OPEN_CLOSE_QUESTION = "/question/open_close/:id";

const questionRoutes = (app: Express) => {
    app.get(GET_QUESTIONS, 
        [ ], controller.getAllEndpoint);

    app.get(GET_QUESTION_BY_ID, 
        [
            middlewares.checkId,
            questionMiddlewares.getQuestion
        ], controller.getByIdEndpoint);

    app.post(CREATE_QUESTION, 
        [
            auth.authenticate,
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

}

export default questionRoutes;