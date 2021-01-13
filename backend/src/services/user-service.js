const User = require('../models/user');
const { Op } = require('sequelize');

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

userService.updateUser = (user) => {
    return User.update(user, {
        where: {
            id: user.id,
        },
    });
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
