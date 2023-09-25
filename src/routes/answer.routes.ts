import { Express } from "express";
import controller from "../controllers/answers.controller";

export const CREATE_ANSWER = "/answers";
export const UPDATE_ANSWER = "/answers/:id";
export const REMOVE_ANSWER = "/answers/:id";
export const VOTE_TO_ANSWER = "/answers/vote/:id";
export const UNVOTE_TO_ANSWER = "/answers/vote/:id";
export const MARK_AS_CORRECT = "/answers/correct/:id"; 

const answerRoutes = (app: Express) => {
    app.post(CREATE_ANSWER,
        [

        ], controller.createEndpoint);

    app.put(UPDATE_ANSWER,
        [

        ], controller.updateEndpoint);

    app.delete(REMOVE_ANSWER,
        [

        ], controller.removeEndpoint);

    app.post(VOTE_TO_ANSWER,
        [

        ], controller.voteEndpoint);

    app.delete(UNVOTE_TO_ANSWER,
        [

        ], controller.unvoteEndpoint);

    app.put(MARK_AS_CORRECT,
        [

        ], controller.makeAsCorrectEndpoint);

};

export default answerRoutes;