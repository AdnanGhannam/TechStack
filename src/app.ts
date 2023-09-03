import express from "express";
import env from "./config/env.config";
import db from "./models/models";

db.init();

const app = express();

const { PORT } = env;
app.listen(PORT, () => {
    console.log(`Listening on port: ${env.PORT}`);
});