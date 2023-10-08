"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_helpers_1 = require("../helpers/response.helpers");
const config = (app, ...routes) => {
    app.get('/', (req, res) => res.json("Everything is working"));
    routes.forEach(route => route(app));
    app.all("*", (req, res) => {
        res.status(404)
            .json((0, response_helpers_1.httpError)(`No \`${req.method}\` endpoint founded on: \`${req.url}\``));
    });
};
const routes = { config };
exports.default = routes;
