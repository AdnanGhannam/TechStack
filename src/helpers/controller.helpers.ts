import { Response } from "express";
import { httpMongoError } from "./response.helpers";

export const tryHandle = async (res: Response, 
        tryAction: () => Promise<void>, 
        catchAction?: (err: any) => any) => {
    try {
        await tryAction();
    } catch (err) {
        if (!catchAction) {
            res.status(400).json(httpMongoError(err));
            return;
        }
        
        catchAction(err);
    }
};