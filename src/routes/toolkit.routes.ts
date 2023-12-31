import { Express } from "express";
import controller from "../controllers/toolkits.controller";
import auth from "../middlewares/auth.middlewares";
import middlewares, { Requires } from "../middlewares";
import toolkitMiddlewares from "../middlewares/toolkit.middlewares";
import sectionMiddlewares from "../middlewares/section.middlewares";

export const CREATE_TOOLKIT = "/toolkits";
export const GET_ALL_TOOLKITS = "/toolkits";
export const GET_TOOLKIT_BY_ID = "/toolkits/:id";
export const UPDATE_TOOLKIT = "/toolkits/:id";
export const REMOVE_TOOLKIT = "/toolkits/:id";
export const ADD_TO_TOOLKIT = "/toolkits/section/:id";
export const GET_ALL_SECTIONS_BY_TOOLKIT = "/toolkits/section/:id"

const toolkitRoutes = (app: Express) => {
    app.post(CREATE_TOOLKIT, 
        [
            auth.authenticate, 
            auth.authorize,
            toolkitMiddlewares.getBody(Requires.All).exec,
        ], controller.createEndpoint);

    app.get(GET_ALL_TOOLKITS, 
        [
        ], controller.getAllEndpoint);
        
    app.get(GET_TOOLKIT_BY_ID, 
        [
            middlewares.checkId,
            toolkitMiddlewares.getToolkit
        ], controller.getByIdEndpoint);
        
    app.put(UPDATE_TOOLKIT, 
        [
            auth.authenticate, 
            auth.authorize,
            middlewares.checkId,
            toolkitMiddlewares.getBody(Requires.Partial).exec,
            toolkitMiddlewares.getToolkit
        ], controller.updateEndpoint);

    app.delete(REMOVE_TOOLKIT, 
        [
            auth.authenticate, 
            auth.authorize,
            middlewares.checkId,
            toolkitMiddlewares.getToolkit
        ], controller.removeEndpoint);

    app.post(ADD_TO_TOOLKIT,
        [
            auth.authenticate, 
            auth.authorize,
            middlewares.checkId,
            toolkitMiddlewares.getToolkit,
            sectionMiddlewares.getBody(Requires.All).exec,
            sectionMiddlewares.checkSectionType
        ], controller.addToEndpoint);

    app.get(GET_ALL_SECTIONS_BY_TOOLKIT,
        [
            sectionMiddlewares.checkSectionType,
            middlewares.checkId,
            toolkitMiddlewares.getToolkit
        ], controller.getAllSectionsInEndpoint);
};

export default toolkitRoutes;