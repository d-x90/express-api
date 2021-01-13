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
            const { token, refreshToken } = await authService.register(
                req.body
            );
            res.status(200).json({ jwt: token, refreshToken });
        } catch (err) {
            res.status(400);
            next(err);
        }
    }
);

authRoutes.post('/login', validateUserLogin, async (req, res, next) => {
    try {
        const { token, refreshToken } = await authService.login(
            req.body.usernameOrEmail,
            req.body.password
        );

        res.json({ jwt: token, refreshToken });
    } catch (err) {
        if (err.message === 'User not found') {
            res.status(404);
        } else {
            res.status(400);
        }

        next(err);
    }
});

authRoutes.post('/refresh-jwt/:token', async (req, res, next) => {
    const refreshToken = req.params.token;

    try {
        const { token, newRefreshToken } = await authService.refreshJwt(
            refreshToken
        );
        res.json({
            jwt: token,
            refreshToken: newRefreshToken,
        });
    } catch (err) {
        res.status(400);
        next(err);
    }
});

authRoutes.post('/revoke-jwt', authenticateJWT, async (req, res, next) => {
    try {
        await authService.revokeJwt(req.userInfo.id);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

authRoutes.get('/checkToken', authenticateJWT, (req, res) => {
    res.json(req.userInfo);
});

module.exports = authRoutes;
