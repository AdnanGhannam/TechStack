import { Express } from "express";

export const GET_ARTICLE = "/articles/:id";
export const UPDATE_ARTICLE = "/articles/:id";
export const REMOVE_ARTICLE = "/articles/:id";
export const REACT_TO_ARTICLE = "/react/articles/:id";
export const UNREACT_TO_ARTICLE = "/react/articles/:id";
export const GET_FEEDBACKS = "/feedbacks";
export const SEND_FEEDBACK = "/articles/:id/send-feedback";
export const REMOVE_FEEDBACK = "/feedbacks/:id";

const articleRoutes = (app: Express) => {
    app.get(GET_ARTICLE, [], );

    app.put(UPDATE_ARTICLE, [], );

    app.delete(REMOVE_ARTICLE, [], );

    app.post(REACT_TO_ARTICLE, [], );

    app.delete(UNREACT_TO_ARTICLE, [], );
    
    app.get(GET_FEEDBACKS, [], );

    app.post(SEND_FEEDBACK, [], );

    app.delete(REMOVE_FEEDBACK, [], );
};

export default articleRoutes;