import express from "express";
import env from "./config/env.config";
import db from "./models/models";
import routes from "./routes/routes";
import userRoutes from "./routes/user.routes";
import middlewares from "./middlewares/middlewares";

db.init();

const app = express();

middlewares.config(app);

routes.config(app, userRoutes);

const { PORT } = env;
app.listen(PORT, () => {
    console.log(`Listening on port: ${env.PORT}`);
});