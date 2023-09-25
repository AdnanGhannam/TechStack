import { RequestHandler } from "express";
import IAnswersController from "../interfaces/IAnswersController";

const createEndpoint: RequestHandler = (req, res) => {

};

const updateEndpoint: RequestHandler = (req, res) => {
    
};

const removeEndpoint: RequestHandler = (req, res) => {
    
};

const voteEndpoint: RequestHandler = (req, res) => {
    
};

const unvoteEndpoint: RequestHandler = (req, res) => {
    
};

const makeAsCorrectEndpoint: RequestHandler = (req, res) => {
    
};

const controller: IAnswersController = {
    createEndpoint,
    updateEndpoint,
    removeEndpoint,
    voteEndpoint,
    unvoteEndpoint,
    makeAsCorrectEndpoint
};

export default controller;