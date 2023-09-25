import { RequestHandler } from "express";

export default interface IAnswersController {
    createEndpoint: RequestHandler;
    updateEndpoint: RequestHandler;
    removeEndpoint: RequestHandler;
    voteEndpoint: RequestHandler;
    unvoteEndpoint: RequestHandler;
    makeAsCorrectEndpoint: RequestHandler;
};