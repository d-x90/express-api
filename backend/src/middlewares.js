const jwt = require('jsonwebtoken');

const { JWT_SIGN_KEY, NODE_ENV } = require('./config');

const middlewares = {};

middlewares.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SIGN_KEY, (err, userInfo) => {
            if (err) {
                res.status(403);
                throw new Error('Forbidden');
            }

            req.userInfo = userInfo;
            next();
        });
    } else {
        res.status(401);
        throw new Error('Unauthorized');
    }
};

middlewares.notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

middlewares.errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: NODE_ENV === 'production' ? '👀' : error.stack,
    });
};

module.exports = middlewares;
