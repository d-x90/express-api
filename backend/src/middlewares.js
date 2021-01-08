const { response } = require('express');
const jwt = require('jsonwebtoken');

const { JWT_SIGN_KEY, NODE_ENV } = require('./config');

const middlewares = {};

middlewares.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            req.userInfo = jwt.verify(token, JWT_SIGN_KEY);
            next();
        } catch (err) {
            res.status(403);
            throw new Error('Forbidden');
        }
    } else {
        res.status(401);
        throw new Error('Unauthorized');
    }
};

middlewares.notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    throw error;
};

middlewares.errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    const response = {
        message: error.message,
    };

    if (NODE_ENV === 'development') {
        response.stack = error.stack;
    }

    res.json(response);
};

module.exports = middlewares;
