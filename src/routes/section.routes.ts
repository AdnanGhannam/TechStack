import { Express } from "express";
import controller from "../controllers/sections.controller";
import sectionMiddlewares from "../middlewares/section.middlewares";
import toolkitMiddlewares from "../middlewares/toolkit.middlewares";
import auth from "../middlewares/auth.middlewares";
import middlewares from "../middlewares/middlewares";

export const CREATE_SECTION = "/sections"
export const GET_ALL_SECTIONS = "/sections/:id"; // Toolkit Id
export const GET_SECTION = "/sections/:id";
export const UPDATE_SECTION = "/sections/:id";
export const REMOVE_SECTION = "/sections/:id";
export const ADD_TO_SECTION = "/sections/article/:id";

const sectionRoutes = (app: Express) => {
    app.post(CREATE_SECTION,
        [
            auth.authenticate, 
            auth.authorize,
            sectionMiddlewares.getBody,
            sectionMiddlewares.checkSectionType
        ], controller.createEndpoint);

    app.get(GET_ALL_SECTIONS,
        [
            sectionMiddlewares.checkSectionType,
            middlewares.checkId,
            toolkitMiddlewares.getToolkit
        ], controller.getAllEndpoint);

    app.get(GET_SECTION,
        [
            middlewares.checkId,
            sectionMiddlewares.getSection
        ], controller.getByIdEndpoint);

    app.put(UPDATE_SECTION,
        [
            auth.authenticate, 
            auth.authorize,
            middlewares.checkId,
            sectionMiddlewares.getSection
        ], controller.updateEndpoint);

    app.delete(REMOVE_SECTION,
        [
            auth.authenticate, 
            auth.authorize,
            middlewares.checkId,
            sectionMiddlewares.getSection
        ], controller.removeEndpoint);

    app.post(ADD_TO_SECTION,
        [
            auth.authenticate, 
            auth.authorize,
            middlewares.checkId,
            sectionMiddlewares.getSection
        ], controller.addToEndpoint);
};

export default sectionRoutes;