import { Express } from "express";
import controller from "../controllers/sections.controller";
import sectionMiddlewares from "../middlewares/section.middlewares";
import toolkitMiddlewares from "../middlewares/toolkit.middlewares";
import auth from "../middlewares/auth.middlewares";
import middlewares, { Requires } from "../middlewares";
import articleMiddlewares from "../middlewares/article.middlewares";

export const GET_SECTION = "/sections/:id";
export const UPDATE_SECTION = "/sections/:id";
export const REMOVE_SECTION = "/sections/:id";
export const ADD_TO_SECTION = "/sections/article/:id";

const sectionRoutes = (app: Express) => {
    app.get(GET_SECTION,
        [
            middlewares.checkId,
            sectionMiddlewares.checkSectionType,
            sectionMiddlewares.getSection
        ], controller.getByIdEndpoint);

    app.put(UPDATE_SECTION,
        [
            auth.authenticate, 
            auth.authorize,
            middlewares.checkId,
            sectionMiddlewares.getBody(Requires.Partial).exec,
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
            articleMiddlewares.getBody(Requires.All).exec,
            sectionMiddlewares.getSection
        ], controller.addToEndpoint);
};

export default sectionRoutes;