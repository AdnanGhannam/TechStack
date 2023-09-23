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
    console.log(err)
    if (!err.errors) {
        if (err.code == 11000) {
            const key = Object.keys(err.keyValue).at(0);
            return httpError(`Path \`${key}\` (\`${err.keyValue[key!]}\`) is already used`);
        }

        return httpError(`Unknown error with code: ${err.code}`);
    }

    return httpError(...Object.keys(err.errors)
            .map((key) => {
                return err.errors[key].message;
            }));
};