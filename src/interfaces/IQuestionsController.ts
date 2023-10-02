import { RequestHandler } from "express";

export default interface IQuestionsController {
    getAllEndpoint: RequestHandler;
    getByIdEndpoint: RequestHandler;
    getPopulareEndpoint: RequestHandler,
    createEndpoint: RequestHandler;
    updateEndpoint: RequestHandler;
    removeEndpoint: RequestHandler;
    voteEndpoint: RequestHandler;
    unvoteEndpoint: RequestHandler;
    openCloseEndpoint: RequestHandler;
    answerEndpoint: RequestHandler;
};