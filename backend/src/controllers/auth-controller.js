const authService = require('../services/auth-service');
const { authenticateJWT } = require('../middlewares');
const {
    validateUserRegistration,
    validateUserLogin,
} = require('../validators');

const authRoutes = require('express').Router();

authRoutes.post(
    '/register',
    validateUserRegistration,
    async (req, res, next) => {
        try {
            const { newUser, token } = await authService.register(req.body);
            res.status(200).json({ jwt: token });
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

authRoutes.post('/login', validateUserLogin, async (req, res, next) => {
    try {
        const token = await authService.login(
            req.body.usernameOrEmail,
            req.body.password
        );

        res.json({ jwt: token });
    } catch (err) {
        if (err.message === 'User not found') {
            res.status(404);
        } else {
            res.status(400);
        }

        next(err);
    }
});

authRoutes.get('/checkToken', authenticateJWT, (req, res) => {
    res.json(req.userInfo);
});

module.exports = authRoutes;
