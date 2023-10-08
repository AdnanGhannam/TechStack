"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Requires = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const response_helpers_1 = require("../helpers/response.helpers");
var Requires;
(function (Requires) {
    Requires[Requires["All"] = 0] = "All";
    Requires[Requires["Partial"] = 1] = "Partial";
})(Requires || (exports.Requires = Requires = {}));
;
const config = (app) => {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cors_1.default)());
};
const checkId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return res.status(400)
            .json((0, response_helpers_1.httpError)(`Id: '${id}' is not valid`));
    }
    next();
};
const middlewares = {
    config,
    checkId
};
exports.default = middlewares;
