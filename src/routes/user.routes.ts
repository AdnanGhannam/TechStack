import { Express } from "express";

export const LOGIN = "/login";
export const REGISTER = "/register";
export const GET_USER = "/users/:id";
export const UPDATE_USER = "/user";
export const REMOVE_USER = "/user";
export const UPDATE_USER_BY_ID = "/users/:id";
export const REMOVE_USER_BY_ID = "/users/:id";
export const GET_COLLECTION = "/collection";
export const ADD_TO_COLLECTION = "/collection/:id";
export const REMOVE_FROM_COLLECTION = "/collection/:id";


const userRoutes = (app: Express) => {
    app.post(LOGIN, [], );

    app.post(REGISTER, [], );

    app.get(GET_USER, [], );

    app.put(UPDATE_USER, [], );
        
    app.delete(REMOVE_USER, [], );

    app.delete(REMOVE_USER_BY_ID, [], );

    app.get(GET_COLLECTION, [], );

    app.post(ADD_TO_COLLECTION, [], );

    app.delete(REMOVE_FROM_COLLECTION, [], );
};

export default userRoutes;