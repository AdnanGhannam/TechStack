import { Express } from "express";

export const CREATE_SECTION = "/sections"
export const GET_ALL_SECTIONS = "/sections";
export const GET_SECTION = "/sections/:id";
export const UPDATE_SECTION = "/sections/:id";
export const REMOVE_SECTION = "/sections/:id";
export const ADD_TO_SECTION = "/sections/article/:id";

const sectionRoutes = (app: Express) => {
    app.post(CREATE_SECTION, [], );

    app.get(GET_ALL_SECTIONS, [], );

    app.get(GET_SECTION, [], );

    app.put(UPDATE_SECTION, [], );

    app.delete(REMOVE_SECTION, [], );

    app.post(ADD_TO_SECTION, [], );    
};

export default sectionRoutes;