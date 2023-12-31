import { RequestHandler } from "express";
import { httpError } from "../helpers/response.helpers";
import db from "../models";
import { CHANGE_PASSWORD, LOGIN, REGISTER, UPDATE_USER } from "../routes/user.routes";
import { createHash } from "crypto";
import UserModel, { UserDocument } from "../models/User.model";
import logger from "../libraries/logger";

/**
 * @passes Name, Email, Password, NewPassword
 */
const getBody: RequestHandler = (req, res, next) => {
    const { name, email, phonenumber, password, newPassword } = req.body;

    switch(req.route.path) {
        case LOGIN:
            if (!name || !password) {
                return res.status(400)
                    .json(httpError("The 'name' and 'password' fields are required"));
            }
            break;
        case REGISTER:
            if (!name || !email || !phonenumber || !password) {
                return res.status(400)
                    .json(httpError("The 'name', 'email', 'phonenumber' and 'password' fields are required"));
            }
            break;
        case CHANGE_PASSWORD:
            if (!password || !newPassword) {
                return res.status(400)
                    .json(httpError("The 'password' and 'newPassword' fields are required"));
            }
            break;
        default:
            if (!name && !email && !phonenumber) {
                return res.status(400)
                    .json(httpError(`One of the following fields is required: 'name', 'email' and 'phonenumber'`));
            }
            break;
    };

    res.locals = {
        ...res.locals,
        name,
        email,
        phonenumber,
        password,
        newPassword
    };

    next();
};

/**
 * @requires Name
 * @passes User
 */
const getUserByName: RequestHandler = async (req, res, next) => {
    const name = res.locals.name;
    const user = await db.User.findOne({ name });

    if (!user) {
        const message = `User with name: '${name}' is not found`;
        logger.error(message);
        return res.status(404)
            .json(httpError(message));
    }

    res.locals.user = user;
    next();
}

/**
 * @passes User
 */
const getUserById: RequestHandler = async (req, res, next) => {
    const id =  req.params.id;
    const user = await db.User.findById(id);

    if (!user) {
        const message = `User with id: '${id}' is not found`;
        logger.error(message)
        return res.status(404)
            .json(httpError(message));
    }

    res.locals.user = user;
    next();
}

/**
 * @requires User, Password
 */
const checkPassword: RequestHandler = (req, res, next) => {
    const { loginUser, user } = res.locals as { loginUser: UserDocument, user: UserDocument };
    const { password } = res.locals;

    const hashed = createHash('sha256').update(password).digest('hex');

    if ((loginUser && loginUser.password != hashed) || (user && user.password != hashed)) {
        logger.error(`Someone tried to access user with Id: '${user.id}' account with a wrong password`);
        return res.status(400)
            .json(httpError(`Password is wrong`));
    }
    
    next();
};

/**
 * @requires Password
 * @passes PasswordHash
 */
const cryptPassword: RequestHandler = (req, res, next) => {
    const { password, newPassword } = res.locals;

    const errorMessage = UserModel.validatePassword(newPassword || password);

    if (errorMessage) {
        return res.status(400).json(httpError(errorMessage));
    }

    res.locals.password = createHash('sha256').update(newPassword ?? password).digest('hex');
    next();
};

const middlewares = {
    getBody,
    getUserByName,
    getUserById,
    checkPassword,
    cryptPassword
};

export default middlewares;