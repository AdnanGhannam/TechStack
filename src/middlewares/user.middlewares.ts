import { RequestHandler } from "express";
import { httpError } from "../helpers/response.helpers";
import db from "../models/models";
import { CHANGE_PASSWORD, LOGIN, REGISTER, UPDATE_USER } from "../routes/user.routes";
import { createHash } from "crypto";
import UserModel from "../models/User.model";

/**
 * @passes Name, Email, Password, NewPassword
 */
const getBody: RequestHandler = (req, res, next) => {
    const { name, email, password, newPassword } = req.body;

    switch(req.route.path) {
        case LOGIN:
            if (!name || !password) {
                res.status(400)
                    .json(httpError("The 'name' and 'password' fields are required"));
                return;
            }
            break;
        case REGISTER:
            if (!name || !email || !password) {
                res.status(400)
                    .json(httpError("The 'name', 'email' and 'password' fields are required"));
                return;
            }
            break;
        case CHANGE_PASSWORD:
            if (!password && !newPassword) {
                res.status(400)
                    .json(httpError("The 'password' and 'newPassword' fields are required"));
                return;
            }
            break;
        default:
            if (!name && !email) {
                res.status(400)
                    .json(httpError(`One of the following fields is required: 'name' and 'email'`));
                return;
            }
            break;
    };

    res.locals = {
        ...res.locals,
        name,
        email,
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
        res.status(404)
            .json(httpError(`User with name: '${name}' is not found`));
        return;
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
        res.status(404)
            .json(httpError(`User with id: '${id}' is not found`));
        return;
    }

    res.locals.user = user;
    next();
}

/**
 * @requires User, Password
 */
const checkPassword: RequestHandler = (req, res, next) => {
    const { user, password } = res.locals;

    const hashed = createHash('sha256').update(password).digest('hex');

    if (user.password != hashed) {
        res.status(400)
            .json(httpError(`Password is wrong`));
        return;
    }
    
    next();
};

/**
 * @requires Password
 * @passes PasswordHash
 */
const cryptPassword: RequestHandler = (req, res, next) => {
    const { password, newPassword } = res.locals;

    const errorMessage = UserModel.validatePassword(newPassword ?? password);

    if (errorMessage) {
        return res.status(400).json(errorMessage);
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