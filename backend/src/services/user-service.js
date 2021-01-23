const User = require('../models/user');
const { Op } = require('sequelize');
const uuid = require('uuid');
const logger = require('../logger-factory').get('./user-service.js');

const userService = {};

userService.createUser = (user) => {
    return User.create(user);
};

userService.getUserById = (userId) => {
    return User.findByPk(userId);
};

userService.getUserByEmail = (email) => {
    return User.findOne({ where: { email } });
};

userService.getUserByUsername = (username) => {
    return User.findOne({ where: { username } });
};

userService.getUserByUsernameOrEmail = (usernameOrEmail) => {
    return User.findOne({
        where: {
            [Op.or]: {
                username: usernameOrEmail,
                email: usernameOrEmail,
            },
        },
    });
};

userService.getJwtValidAfterDateById = async (userId) => {
    const result = await User.findOne({
        attributes: ['jwtValidAfter'],
        where: {
            id: userId,
        },
    });

    if (!result) {
        throw new Error('User not found');
    }

    return result.jwtValidAfter;
};

userService.getUserByRefreshToken = (refreshToken) => {
    return User.findOne({
        where: {
            refreshToken,
        },
    });
};

userService.updateUser = (user) => {
    return User.update(user, {
        where: {
            id: user.id,
        },
    });
};

userService.updateRefreshToken = async (userId) => {
    const refreshToken = uuid.v4();

    await User.update(
        { refreshToken },
        {
            where: {
                id: userId,
            },
        }
    );

    return refreshToken;
};

userService.revokeJwtForUser = async (userId) => {
    const jwtValidAfter = Date.now();
    const refreshToken = uuid.v4();

    const [rowsUpdated] = await User.update(
        { jwtValidAfter, refreshToken },
        {
            where: {
                id: userId,
            },
        }
    );

    if (rowsUpdated !== 1) {
        throw new Error('Update failed');
    }

    return jwtValidAfter;
};

userService.deleteUser = (userId) => {
    return User.destroy({
        where: {
            id: userId,
        },
    });
};

userService.checkIfUserExistsByEmail = async (email) => {
    const count = await User.count({
        where: {
            email,
        },
    });

    return count > 0;
};

userService.checkIfUserExistsByUsername = async (username) => {
    const count = await User.count({
        where: {
            username,
        },
    });

    return count > 0;
};

module.exports = userService;
