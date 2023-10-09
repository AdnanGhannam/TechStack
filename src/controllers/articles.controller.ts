import { RequestHandler } from "express";
import { httpError, httpSuccess } from "../helpers/response.helpers";
import { tryHandle } from "../helpers/controller.helpers";
import db from "../models";
import { ArticleDocument } from "../models/Article.model";
import { UserDocument } from "../models/User.model";
import { ReactionDocument } from "../models/Reaction.model";
import IArticlesController from "../interfaces/IArticlesController";
import logger from "../libraries/logger";
import { ToolkitDocument } from "../models/Toolkit.model";

const getAllEndpoint: RequestHandler = async (req, res) => {
    const sections = await db.Section.find({ })
        .populate("articles")
        .populate({
            path: "toolkit",
            select: "name"
        });

    const articles: ArticleDocument[] & any[] = [];

    sections.forEach(section => {
        section.toObject().articles.forEach((article, index) => {
            articles.push({
                ...article,
                toolkit: {
                    _id: (<ToolkitDocument> section.toolkit).id,
                    name: (<ToolkitDocument> section.toolkit).name
                },
                section: {
                    _id: section.id,
                    title: section.title
                },
                order: index
            });
        });
    })
    

    logger.info(`Return all articles`);
    res.json(httpSuccess(articles));
};

const getByIdEndpoint: RequestHandler = async (req, res) => {
    const { article } = res.locals as { article: ArticleDocument };

    await article.updateOne({ $inc: { views: 1 }});

    logger.info(`Return article with Id: '${article.id}'`);
    res.status(200)
        .json(httpSuccess(article));
};


const getPopulareEndpoint: RequestHandler = async (req, res) => {
    const top = await db.Article.find().sort("-views").limit(5).select("title description");

    logger.info(`Return top 5 articles`);
    res.json(httpSuccess(top));
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
        }, { runValidators: true });

        logger.info(`Update article with Id: '${article.id}' by admin with Id: '${user.id}'`);
        res.status(204).end();
    });
};

const removeEndpoint: RequestHandler = (req, res) => {
    const { 
        article, 
        loginUser: user 
    } = res.locals as {
        article: ArticleDocument,
        loginUser: UserDocument
    }

    tryHandle(res, async () => {
        await article.deleteOne();
        await db.Section.findByIdAndUpdate(article.section, { $pull: { articles: article.id } });

        logger.info(`Remove article with Id: '${article.id}' by admin with Id: '${user.id}'`);
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
            await article.updateOne({ $addToSet: { reactions: newReaction.id }});
        }

        logger.info(`React to article with Id: '${article.id}' by user with Id: '${loginUser.id}'`);
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

        logger.info(`Unreact to article with Id: '${article.id}' by user with Id: '${loginUser.id}'`);
        res.status(204).end();
    });
};

const getFeedbacksEndpoint: RequestHandler = async (req, res) => {
    const feedbacks = await db.Feedback.find()
        .populate("user")
        .populate({
            path: "article",
            select: "title"
        });

    logger.info(`Return feedbacks`);
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

        await article.updateOne({ $addToSet: { feedbacks: feedback.id }});

        logger.info(`Send feedback to article with Id: '${article.id}' by user with Id: '${loginUser.id}'`);
        res.status(201)
            .json(httpSuccess(feedback));
    });
};

const removeFeedbackEndpoint: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { loginUser: user } = res.locals as { loginUser: UserDocument };
    const feedback = await db.Feedback.findByIdAndDelete(id);

    await db.Article.findByIdAndUpdate(feedback?.article, { $pull: { feedbacks: id } });

    logger.info(`Send feedback with Id: '${feedback?.id}' by admin with Id: '${user.id}'`);
    res.status(204).end();
};

const controller: IArticlesController = {
    getAllEndpoint,
    getByIdEndpoint,
    getPopulareEndpoint,
    updateEndpoint,
    removeEndpoint,
    reactToEndpoint,
    unReactToEndpoint,
    getFeedbacksEndpoint,
    sendFeedbackEndpoint,
    removeFeedbackEndpoint
};

export default controller;