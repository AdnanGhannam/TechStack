"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = __importDefault(require("../config/env.config"));
const User_model_1 = __importDefault(require("./User.model"));
const Article_model_1 = __importDefault(require("./Article.model"));
const Section_model_1 = __importDefault(require("./Section.model"));
const Collection_model_1 = __importDefault(require("./Collection.model"));
const Reaction_model_1 = __importDefault(require("./Reaction.model"));
const Feedback_model_1 = __importDefault(require("./Feedback.model"));
const Toolkit_model_1 = __importDefault(require("./Toolkit.model"));
const Question_model_1 = __importDefault(require("./Question.model"));
const Answer_model_1 = __importDefault(require("./Answer.model"));
const Vote_model_1 = __importDefault(require("./Vote.model"));
const init = () => {
    const { MONGO_URI } = env_config_1.default;
    const uri = MONGO_URI;
    mongoose_1.default.connect(uri)
        .then(() => console.info(`MongoDB connected on ${uri}`))
        .catch(err => {
        console.error("APPLICATION ERROR: MONGO_DB ERROR:\n", err);
        process.exit(1);
    });
};
const db = {
    init,
    User: User_model_1.default.create(),
    Article: Article_model_1.default.create(),
    Section: Section_model_1.default.create(),
    Collection: Collection_model_1.default.create(),
    Reaction: Reaction_model_1.default.create(),
    Feedback: Feedback_model_1.default.create(),
    Toolkit: Toolkit_model_1.default.create(),
    Question: Question_model_1.default.create(),
    Answer: Answer_model_1.default.create(),
    Vote: Vote_model_1.default.create()
};
exports.default = db;
