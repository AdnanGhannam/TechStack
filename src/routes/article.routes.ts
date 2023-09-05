import { Express } from "express";
import controller from "../controllers/articles.controller";
import auth from "../middlewares/auth.middlewares";
import middlewares from "../middlewares/middlewares";
import articleMiddlewares from "../middlewares/article.middlewares";

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
        [
            middlewares.checkId,
            articleMiddlewares.getArticle
        ], controller.getByIdEndpoint);

    app.put(UPDATE_ARTICLE,
        [
            auth.authenticate,
            auth.authorize,
            middlewares.checkId,
            articleMiddlewares.getArticle,
            articleMiddlewares.getBody
        ], controller.updateEndpoint);

    app.delete(REMOVE_ARTICLE,
        [
            auth.authenticate, 
            auth.authorize,
            middlewares.checkId,
            articleMiddlewares.getArticle
        ], controller.removeEndpoint);

    app.post(REACT_TO_ARTICLE,
        [
            auth.authenticate,
            middlewares.checkId,
            articleMiddlewares.getArticle,
            articleMiddlewares.getReactionType,
        ], controller.reactToEndpoint);

    app.delete(UNREACT_TO_ARTICLE,
        [
            auth.authenticate,
            middlewares.checkId,
            articleMiddlewares.getArticle
        ], controller.unReactToEndpoint);
    
    app.get(GET_FEEDBACKS,
        [
            auth.authenticate, 
            auth.authorize
        ], controller.getFeedbacksEndpoint);

    app.post(SEND_FEEDBACK,
        [
            auth.authenticate,
            middlewares.checkId,
            articleMiddlewares.getArticle
        ], controller.sendFeedbackEndpoint);

    app.delete(REMOVE_FEEDBACK,
        [
            auth.authenticate, 
            auth.authorize,
            middlewares.checkId
        ], controller.removeFeedbackEndpoint);
};

export default articleRoutes;