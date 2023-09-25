import express from "express";
import env from "./config/env.config";
import db from "./models";
import routes from "./routes";
import userRoutes from "./routes/user.routes";
import middlewares from "./middlewares";
import articleRoutes from "./routes/article.routes";
import sectionRoutes from "./routes/section.routes";
import toolkitRoutes from "./routes/toolkit.routes";
import questionRoutes from "./routes/question.routes";
import answerRoutes from "./routes/answer.routes";

db.init();

const app = express();

middlewares.config(app);

routes.config(app, 
    userRoutes, 
    articleRoutes, 
    sectionRoutes, 
    toolkitRoutes, 
    questionRoutes,
    answerRoutes);

const { PORT } = env;
app.listen(PORT, () => {
    console.log(`Listening on port: ${env.PORT}`);
});