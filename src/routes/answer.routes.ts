import { Express } from "express";
import controller from "../controllers/answers.controller";
import auth from "../middlewares/auth.middlewares";
import answerMiddlewares from "../middlewares/answer.middlewares";
import questionMiddlewares from "../middlewares/question.middlewares";
import middlewares from "../middlewares";

export const CREATE_ANSWER = "/answers";
export const UPDATE_ANSWER = "/answers/:id";
export const REMOVE_ANSWER = "/answers/:id";
export const VOTE_TO_ANSWER = "/answers/vote/:id";
export const UNVOTE_TO_ANSWER = "/answers/vote/:id";
export const MARK_AS_CORRECT = "/answers/correct/:id"; 

const answerRoutes = (app: Express) => {
    app.post(CREATE_ANSWER,
        [
            auth.authenticate,
            answerMiddlewares.getBody
        ], controller.createEndpoint);

    app.put(UPDATE_ANSWER,
        [
            auth.authenticate,
            answerMiddlewares.getBody,
            middlewares.checkId,
            answerMiddlewares.getAnswer,
            answerMiddlewares.canModify
        ], controller.updateEndpoint);

    app.delete(REMOVE_ANSWER,
        [
            auth.authenticate,
            middlewares.checkId,
            answerMiddlewares.getAnswer,
            answerMiddlewares.canModify
        ], controller.removeEndpoint);

    app.post(VOTE_TO_ANSWER,
        [
            auth.authenticate,
            questionMiddlewares.getVote,
            middlewares.checkId,
            answerMiddlewares.getAnswer
        ], controller.voteEndpoint);

    app.delete(UNVOTE_TO_ANSWER,
        [
            auth.authenticate,
            middlewares.checkId,
            answerMiddlewares.getAnswer
        ], controller.unvoteEndpoint);

    app.put(MARK_AS_CORRECT,
        [
            auth.authenticate,
            middlewares.checkId,
            answerMiddlewares.getAnswer,
            answerMiddlewares.canModify
        ], controller.makeAsCorrectEndpoint);
};

export default answerRoutes;