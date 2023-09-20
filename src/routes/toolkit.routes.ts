import { Express } from "express";
import controller from "../controllers/toolkits.controller";

export const CREATE_TOOLKIT = "toolkits";
export const GET_ALL_TOOLKITS = "toolkits";
export const GET_TOOLKIT_BY_ID = "toolkits/:id";
export const UPDATE_TOOLKIT = "toolkits/:id";
export const REMOVE_TOOLKIT = "toolkits/:id";

const toolkitRoutes = (app: Express) => {
    app.post(CREATE_TOOLKIT, 
        [

        ], controller.createEndpoint);

    app.get(GET_ALL_TOOLKITS, 
        [

        ], controller.getAllEndpoint);
        
    app.get(GET_TOOLKIT_BY_ID, 
        [

        ], controller.getByIdEndpoint);
        
    app.put(UPDATE_TOOLKIT, 
        [

        ], controller.updateEndpoint);

    app.delete(REMOVE_TOOLKIT, 
        [

        ], controller.removeEndpoint);
};

export default toolkitRoutes;