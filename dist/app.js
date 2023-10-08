"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_config_1 = __importDefault(require("./config/env.config"));
const models_1 = __importDefault(require("./models"));
const routes_1 = __importDefault(require("./routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const middlewares_1 = __importDefault(require("./middlewares"));
const article_routes_1 = __importDefault(require("./routes/article.routes"));
const section_routes_1 = __importDefault(require("./routes/section.routes"));
const toolkit_routes_1 = __importDefault(require("./routes/toolkit.routes"));
const question_routes_1 = __importDefault(require("./routes/question.routes"));
const answer_routes_1 = __importDefault(require("./routes/answer.routes"));
models_1.default.init();
const app = (0, express_1.default)();
middlewares_1.default.config(app);
routes_1.default.config(app, user_routes_1.default, article_routes_1.default, section_routes_1.default, toolkit_routes_1.default, question_routes_1.default, answer_routes_1.default);
const { PORT } = env_config_1.default;
app.listen(PORT, () => {
    console.log(`Listening on port: ${env_config_1.default.PORT}`);
});
