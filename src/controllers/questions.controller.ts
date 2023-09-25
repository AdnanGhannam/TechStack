import { RequestHandler } from "express";
import IQuestionsController from "../interfaces/IQuestionsController";

const getAllEndpoint: RequestHandler = (req, res) => {

};

const getByIdEndpoint: RequestHandler = (req, res) => {
    
};

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

const openCloseEndpoint: RequestHandler = (req, res) => {
    
};

const controller: IQuestionsController = {
    getAllEndpoint,
    getByIdEndpoint,
    createEndpoint,
    updateEndpoint,
    removeEndpoint,
    voteEndpoint,
    unvoteEndpoint,
    openCloseEndpoint
};

export default controller;