import express from "express";
import env from "./config/env.config";
import db from "./models/models";
import routes from "./routes/routes";
import userRoutes from "./routes/user.routes";
import middlewares from "./middlewares/middlewares";
import articleRoutes from "./routes/article.routes";
import sectionRoutes from "./routes/section.routes";
import toolkitRoutes from "./routes/toolkit.routes";

db.init();

const app = express();

middlewares.config(app);

routes.config(app, userRoutes, articleRoutes, sectionRoutes, toolkitRoutes);

const { PORT } = env;
app.listen(PORT, () => {
    console.log(`Listening on port: ${env.PORT}`);
});