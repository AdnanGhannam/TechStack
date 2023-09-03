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
