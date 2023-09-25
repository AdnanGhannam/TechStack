import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../config/env.config";
import { httpError } from "../helpers/response.helpers";
import { Types } from "mongoose";
import db from "../models";
import { UserDocument } from "../models/User.model";

/**
 * @passes loginUser
*/
const authenticate: RequestHandler = (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
        return res.status(403)
            .json(httpError("JWT token is required!"));
    }

    const { SECRET } = env;

    jwt.verify(token, SECRET, async (err, doc: any) => {
        if (err) {
            return res.status(400)
                .json(httpError("JWT token is not valid"));
        }
        
        const userId = doc?.["id"];

        if (!userId) {
            return res.status(400)
                .json(httpError("JWT token is not valid!"));
        }

        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json(httpError(`Id is not valid`));
        }

        const user = await db.User.findById(userId);

        if (!user) {
            return res.status(404).json(httpError(`User not found`));
        }

        res.locals.loginUser = user;

        next();
    });
};

/**
 * @requires LoginUser
 * @passes Privilege
*/
const authorize: RequestHandler = async (req, res, next) => {
    const { loginUser } = res.locals as { loginUser: UserDocument };

    if (loginUser.privilege != "administrator") {
        return res.status(401)
            .json(httpError("You don't have privilege to make this action"));
    }

    res.locals.privilege = loginUser.privilege;

    next();
};

const auth = {
    authenticate,
    authorize
};

export default auth;