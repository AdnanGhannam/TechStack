import logger from "../libraries/logger";

export const httpResponse = (success: boolean, data?: any, errors: any[] = []) => {
    return { 
        success, 
        data, 
        errors: errors.map(error => { return { message: error } })
    };
};

export const httpSuccess = (data: any) => {
    return httpResponse(true, data);
}

export const httpError = (...messages: string[]) => {
    return httpResponse(false, null, messages);
}

export const httpMongoError = (err: any) => {
    if (!err.errors) {
        console.log(err)
        const message = `Unknown error`;
        logger.error(message + ' with code: ' + err.code);
        return httpError(message);
    }

    return httpError(...Object.keys(err.errors)
            .map((key) => {
                return err.errors[key].message;
            }));
};