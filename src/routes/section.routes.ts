import { Express } from "express";
import controller from "../controllers/sections.controller";

export const CREATE_SECTION = "/sections"
export const GET_ALL_SECTIONS = "/sections";
export const GET_SECTION = "/sections/:id";
export const UPDATE_SECTION = "/sections/:id";
export const REMOVE_SECTION = "/sections/:id";
export const ADD_TO_SECTION = "/sections/article/:id";

const sectionRoutes = (app: Express) => {
    app.post(CREATE_SECTION,
        [], controller.createEndpoint);

    app.get(GET_ALL_SECTIONS,
        [], controller.getAllEndpoint);

    app.get(GET_SECTION,
        [], controller.getByIdEndpoint);

    app.put(UPDATE_SECTION,
        [], controller.updateEndpoint);

    app.delete(REMOVE_SECTION,
        [], controller.removeEndpoint);

    app.post(ADD_TO_SECTION,
        [], controller.addToEndpoint);
};

export default sectionRoutes;