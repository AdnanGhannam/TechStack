import { Express } from "express";
import controller from "../controllers/articles.controller";

export const GET_ARTICLE = "/articles/:id";
export const UPDATE_ARTICLE = "/articles/:id";
export const REMOVE_ARTICLE = "/articles/:id";
export const REACT_TO_ARTICLE = "/react/articles/:id";
export const UNREACT_TO_ARTICLE = "/react/articles/:id";
export const GET_FEEDBACKS = "/feedbacks";
export const SEND_FEEDBACK = "/articles/:id/send-feedback";
export const REMOVE_FEEDBACK = "/feedbacks/:id";

const articleRoutes = (app: Express) => {
    app.get(GET_ARTICLE,
        [], controller.getByIdEndpoint);

    app.put(UPDATE_ARTICLE,
        [], controller.updateEndpoint);

    app.delete(REMOVE_ARTICLE,
        [], controller.removeEndpoint);

    app.post(REACT_TO_ARTICLE,
        [], controller.reactToEndpoint);

    app.delete(UNREACT_TO_ARTICLE,
        [], controller.unReactToEndpoint);
    
    app.get(GET_FEEDBACKS,
        [], controller.getFeedbacksEndpoint);

    app.post(SEND_FEEDBACK,
        [], controller.sendFeedbackEndpoint);

    app.delete(REMOVE_FEEDBACK,
        [], controller.removeFeedbackEndpoint);
};

export default articleRoutes;