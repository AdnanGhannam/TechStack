import { Express } from "express";
import { httpError } from "../helpers/response.helpers";

type Routes = (app: Express) => void;

const config = (app: Express, ...routes: Array<Routes>) => {
    routes.forEach(route => route(app));
    app.all("*", (req, res) => {
        res.status(404)
            .json(httpError(`No \`${req.method}\` endpoint founded on: \`${req.url}\``));
    });
};

const routes = { config };

export default routes;