"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpMongoError = exports.httpError = exports.httpSuccess = exports.httpResponse = void 0;
const logger_1 = __importDefault(require("../libraries/logger"));
const httpResponse = (success, data, errors = []) => {
    return {
        success,
        data,
        errors: errors.map(error => { return { message: error }; })
    };
};
exports.httpResponse = httpResponse;
const httpSuccess = (data) => {
    return (0, exports.httpResponse)(true, data);
};
exports.httpSuccess = httpSuccess;
const httpError = (...messages) => {
    return (0, exports.httpResponse)(false, null, messages);
};
exports.httpError = httpError;
const httpMongoError = (err) => {
    if (!err.errors) {
        const message = `Unknown error with code: ${err.code}`;
        logger_1.default.error(message);
        return (0, exports.httpError)(message);
    }
    return (0, exports.httpError)(...Object.keys(err.errors)
        .map((key) => {
        return err.errors[key].message;
    }));
};
exports.httpMongoError = httpMongoError;
