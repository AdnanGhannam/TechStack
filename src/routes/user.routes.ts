import { Express } from "express";
import controller from "../controllers/users.controller";

export const LOGIN = "/login";
export const REGISTER = "/register";
export const GET_USER = "/user";
export const UPDATE_USER = "/user";
export const REMOVE_USER = "/user";
export const GET_USER_BY_ID = "/users/:id";
export const UPDATE_USER_BY_ID = "/users/:id";
export const REMOVE_USER_BY_ID = "/users/:id";
export const GET_COLLECTION = "/collection";
export const ADD_TO_COLLECTION = "/collection/:id";
export const REMOVE_FROM_COLLECTION = "/collection/:id";

const userRoutes = (app: Express) => {
    app.post(LOGIN,
        [], controller.loginEndpoint);

    app.post(REGISTER,
        [], controller.registerEndpoint);

    app.get(GET_USER,
        [], controller.getEndpoint);

    app.put(UPDATE_USER,
        [], controller.updateEndpoint);
        
    app.delete(REMOVE_USER,
        [], controller.removeEndpoint);

    app.get(GET_USER_BY_ID,
        [], controller.getByIdEndpoint);

    app.put(UPDATE_USER_BY_ID,
        [], controller.updateByIdEndpoint);

    app.delete(REMOVE_USER_BY_ID,
        [], controller.removeByIdEndpoint);

    app.get(GET_COLLECTION,
        [], controller.getCollectionEndpoint);

    app.post(ADD_TO_COLLECTION,
        [], controller.addToCollectionEndpoint);

    app.delete(REMOVE_FROM_COLLECTION,
        [], controller.removeFromCollectionEndpoint);
};

export default userRoutes;