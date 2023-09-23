import { RequestHandler } from "express";

export default interface IToolkitsController {
    createEndpoint: RequestHandler;

    getAllEndpoint: RequestHandler;

    getByIdEndpoint: RequestHandler;
    
    updateEndpoint: RequestHandler;
    
    removeEndpoint: RequestHandler;

    addToEndpoint: RequestHandler;

    getAllSectionsInEndpoint: RequestHandler;
};