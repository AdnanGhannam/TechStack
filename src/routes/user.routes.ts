import { Express } from "express";
import controller from "../controllers/users.controller";
import userMiddlewares from "../middlewares/user.middlewares";
import articleMiddlewares from "../middlewares/article.middlewares";
import auth from "../middlewares/auth.middlewares";
import middlewares from "../middlewares";

export const LOGIN = "/login";
export const ADMINS_LOGIN = "/admins/login";
export const REGISTER = "/register";
export const GET_USERS = "/users";
export const GET_USER = "/user";
export const UPDATE_USER = "/user";
export const CHANGE_PASSWORD = "/user/change-password";
export const REMOVE_USER = "/user";
export const GET_USER_BY_ID = "/users/:id";
export const UPDATE_USER_BY_ID = "/users/:id";
export const REMOVE_USER_BY_ID = "/users/:id";
export const GET_MY_QUESTIONS = "/user/my-questions";
export const GET_COLLECTION = "/collection";
export const ADD_TO_COLLECTION = "/collection/:id";
export const REMOVE_FROM_COLLECTION = "/collection/:id";

const userRoutes = (app: Express) => {
    app.post(ADMINS_LOGIN,
        [
            userMiddlewares.getBody,
            userMiddlewares.getUserByName,
            userMiddlewares.checkPassword
        ], controller.loginEndpoint);

    app.post(LOGIN,
        [
            userMiddlewares.getBody,
            userMiddlewares.getUserByName,
            userMiddlewares.checkPassword
        ], controller.loginEndpoint);

    app.post(REGISTER,
        [
            userMiddlewares.getBody,
            userMiddlewares.cryptPassword
        ], controller.registerEndpoint);

    app.get(GET_USERS,
        [
            auth.authenticate,
            auth.authorize,
        ], controller.getAllEndpoint);

    app.get(GET_USER,
        [
            auth.authenticate
        ], controller.getEndpoint);

    app.put(UPDATE_USER,
        [
            auth.authenticate,
            userMiddlewares.getBody
        ], controller.updateEndpoint);
        
    app.put(CHANGE_PASSWORD,
        [
            auth.authenticate,
            userMiddlewares.getBody,
            userMiddlewares.checkPassword,
            userMiddlewares.cryptPassword
        ], controller.changePasswordEndpoint);

    app.delete(REMOVE_USER,
        [
            auth.authenticate,
        ], controller.removeEndpoint);

    app.get(GET_USER_BY_ID,
        [
            middlewares.checkId,
            userMiddlewares.getUserById
        ], controller.getByIdEndpoint);

    app.put(UPDATE_USER_BY_ID,
        [
            auth.authenticate, 
            userMiddlewares.getUserById,
            auth.authorize,
            middlewares.checkId,
            userMiddlewares.getBody
        ], controller.updateByIdEndpoint);

    app.delete(REMOVE_USER_BY_ID,
        [
            auth.authenticate, 
            userMiddlewares.getUserById,
            auth.authorize,
            middlewares.checkId
        ], controller.removeByIdEndpoint);

    app.get(GET_MY_QUESTIONS, 
        [
            auth.authenticate
        ], controller.getMyQuestionsEndpoint);

    app.get(GET_COLLECTION,
        [
            auth.authenticate
        ], controller.getCollectionEndpoint);

    app.post(ADD_TO_COLLECTION,
        [
            auth.authenticate,
            middlewares.checkId,
            articleMiddlewares.getArticle,
        ], controller.addToCollectionEndpoint);

    app.delete(REMOVE_FROM_COLLECTION,
        [
            auth.authenticate,
            middlewares.checkId,
            articleMiddlewares.getArticle,
        ], controller.removeFromCollectionEndpoint);
};

export default userRoutes;