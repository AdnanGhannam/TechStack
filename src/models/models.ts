import mongoose from "mongoose";
import env from "../config/env.config";
import UserModel, { TUser } from "./User.model";
import ArticleModel from "./Article.model";
import SectionModel from "./Section.model";
import CollectionModel from "./Collection.model";
import ReactionModel from "./Reaction.model";
import FeedbackModel from "./Feedback.model";
import ToolkitModel from "./Toolkit.model";
import QuestionModel from "./Question.model";
import AnswerModel from "./Answer.model";
import VoteModel from "./Vote.model";

const init = () => {
    const { DB_HOST: HOST, DB_PORT: PORT, DB_NAME: NAME } = env;

    const uri = `mongodb://${HOST}:${PORT}/${NAME}`;

        mongoose.connect(uri)
            .then(() => console.info(`MongoDB connected on port: ${PORT}`))
            .catch(err => {
                console.error("APPLICATION ERROR: MONGO_DB ERROR:\n", err)
                process.exit(1);
            });
};

const db = {
    init,
    User: UserModel.create(),
    Article: ArticleModel.create(),
    Section: SectionModel.create(),
    Collection: CollectionModel.create(),
    Reaction: ReactionModel.create(),
    Feedback: FeedbackModel.create(),
    Toolkit: ToolkitModel.create(),
    Question: QuestionModel.create(),
    Answer: AnswerModel.create(),
    Vote: VoteModel.create()
};

export default db;