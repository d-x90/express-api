const { authenticateJWT } = require('../middlewares');
const userService = require('../services/user-service');
const userRoutes = require('express').Router();
const logger = require('../logger').get('user-controller');
const { mapUserToUserDto } = require('../mapper');

userRoutes.get('/own-user', authenticateJWT, async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.userInfo.id);
        if (user) {
            return res.json(mapUserToUserDto(user));
        }

        res.sendStatus(404);
    } catch (err) {
        logger.error(`Couldn't get user with id: '${req.userInfo.id}'`);
        next(err);
    }
});

userRoutes.delete('/own-user', authenticateJWT, async (req, res, next) => {
    try {
        const numberOfUserDeleted = await userService.deleteUser(
            req.userInfo.id
        );

        if (numberOfUserDeleted === 1) {
            res.sendStatus(204);
        } else if (numberOfUserDeleted === 0) {
            res.sendStatus(404);
        } else {
            next(new Error());
        }
    } catch (err) {
        logger.error(`Couldn't delete user with id: '${req.userInfo.id}'`);
        next(err);
    }
});

module.exports = userRoutes;
