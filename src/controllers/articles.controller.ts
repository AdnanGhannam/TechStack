import { RequestHandler } from "express";
import { httpError, httpSuccess } from "../helpers/response.helpers";
import { tryHandle } from "../helpers/controller.helpers";
import db from "../models/models";
import { ArticleDocument } from "../models/Article.model";
import { UserDocument } from "../models/User.model";
import { ReactionDocument } from "../models/Reaction.model";
import IArticlesController from "../interfaces/IArticlesController";

const getByIdEndpoint: RequestHandler = (req, res) => {
    const { article } = res.locals as { article: ArticleDocument };

    res.status(200)
        .json(httpSuccess(article));
};

const updateEndpoint: RequestHandler = (req, res) => {
    const { title, description, content } = res.locals;
    const { 
        article, 
        loginUser: user 
    } = res.locals as {
        article: ArticleDocument,
        loginUser: UserDocument
    }

    if (!article.creators.includes(user.id)) {
        article.creators.push(user.id);
    }

    tryHandle(res, async () => {
        await article.updateOne({
            title: title || article.title,
            description: description || article.description,
            content: content || article.content,
            lastUpdateFrom: user.id
        });

        res.status(204).end();
    });
};

const removeEndpoint: RequestHandler = (req, res) => {
    const { article } = res.locals as { article: ArticleDocument };

    tryHandle(res, async () => {
        await db.Section.findByIdAndUpdate(article.section, { $pull: { articles: article.id } });
        await article.deleteOne();

        res.status(204).end();
    });
};

const reactToEndpoint: RequestHandler = (req, res) => {
    const { type } = res.locals;
    const { article } = res.locals as { article: ArticleDocument };

    tryHandle(res, async () => {
        const { loginUser } = res.locals as { loginUser: UserDocument };
        let reacted = false;
        (<ReactionDocument[]> article.reactions).forEach(async reaction => {
            if (reaction.user == loginUser.id && reaction.article == article.id) {
                reacted = true;
                await reaction.updateOne({ type });
                return;
            }
        });

        if (!reacted) {
            const newReaction = await db.Reaction.create({ 
                type,
                user: loginUser.id, 
                article: article.id
            });
            await article.updateOne({ reactions: [...article.reactions, newReaction] });
        }

        res.status(204).end();
    });
};

const unReactToEndpoint: RequestHandler = (req, res) => {
    const { 
        article, 
        loginUser
    } = res.locals as {
        article: ArticleDocument,
        loginUser: UserDocument
    }

    let reactionId: string = "";
    (<ReactionDocument[]> article.reactions).forEach(reaction => {
        if (reaction.user == loginUser.id && reaction.article == article.id) {
            reactionId = reaction.id;
        }
    });

    if (!reactionId) {
        return res.status(404)
            .json(httpError("You didn't react to this article"));
    }

    tryHandle(res, async () => {
        await article.updateOne({ $pull: { reactions: reactionId }});
        await db.Reaction.deleteOne({ _id: reactionId });
        res.status(204).end();
    });
};

const getFeedbacksEndpoint: RequestHandler = async (req, res) => {
    const feedbacks = await db.Feedback.find();

    res.status(200).json(httpSuccess(feedbacks));
};

const sendFeedbackEndpoint: RequestHandler = (req, res) => {
    const { text } = req.body;
    const { 
        article, 
        loginUser
    } = res.locals as {
        article: ArticleDocument,
        loginUser: UserDocument
    }

    if (!text) {
        return res.status(400)
            .json(httpError("The 'text' field is required"));
    }

    tryHandle(res, async () => {
        const feedback = await db.Feedback.create({
            user: loginUser.id,
            article: article.id,
            text
        });

        await article.updateOne({ feedbacks: [...article.feedbacks, feedback.id]});

        res.status(201)
            .json(httpSuccess(feedback));
    });
};

const removeFeedbackEndpoint: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const feedback = await db.Feedback.findByIdAndDelete(id);

    await db.Article.findByIdAndUpdate(feedback?.article, { $pull: { feedbacks: id } });

    res.status(204).end();
};

const controller: IArticlesController = {
    getByIdEndpoint,
    updateEndpoint,
    removeEndpoint,
    reactToEndpoint,
    unReactToEndpoint,
    getFeedbacksEndpoint,
    sendFeedbackEndpoint,
    removeFeedbackEndpoint
};

export default controller;