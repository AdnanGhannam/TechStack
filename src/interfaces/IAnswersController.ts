import { RequestHandler } from "express";

export default interface IAnswersController {
    updateEndpoint: RequestHandler;
    removeEndpoint: RequestHandler;
    voteEndpoint: RequestHandler;
    unvoteEndpoint: RequestHandler;
    makeAsCorrectEndpoint: RequestHandler;
};