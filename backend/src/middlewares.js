const jwt = require('jsonwebtoken');
const userService = require('./services/user-service');

const { JWT_SIGN_KEY, NODE_ENV } = require('./config');

const middlewares = {};

const getTokenPayload = async (authorizationHeader) => {
    const token = authorizationHeader.split(' ')[1];

    const tokenPayload = jwt.verify(token, JWT_SIGN_KEY);

    let jwtValidAfter = await userService.getJwtValidAfterDateById(
        tokenPayload.id
    );
    const issuedAt = Number(tokenPayload.iat);
    jwtValidAfter = Math.floor(jwtValidAfter.getTime() / 1000);

    if (issuedAt < jwtValidAfter) {
        throw new Error('Jwt issued before valid date');
    }

    return tokenPayload;
};

middlewares.authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401);
        return next(new Error('Unauthorized'));
    }

    try {
        req.userInfo = await getTokenPayload(authHeader);
        next();
    } catch (err) {
        res.status(403);
        next(new Error('Forbidden'));
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
