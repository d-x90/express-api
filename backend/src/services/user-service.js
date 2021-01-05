const User = require('../models/user');
const { Op } = require('sequelize');

const userService = {};

userService.createUser = async (user) => {
    return await User.create(user);
};

userService.getUserById = async (userId) => {
    return await User.findByPk(userId);
};

userService.getUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

userService.getUserByUsername = async (username) => {
    return await User.findOne({ where: { username } });
};

userService.getUserByUsernameOrEmail = async (usernameOrEmail) => {
    return await User.findOne({
        where: {
            [Op.or]: {
                username: usernameOrEmail,
                email: usernameOrEmail,
            },
        },
    });
};

userService.updateUser = async (user) => {
    return await User.update(user, {
        where: {
            id: user.id,
        },
    });
};

userService.deleteUser = async (userId) => {
    return await User.destroy({
        where: {
            id: userId,
        },
    });
};

userService.checkIfUserExistsByEmail = async (email) => {
    const { count, rows } = await User.findAndCountAll({
        where: {
            email,
        },
    });

    return count > 0;
};

userService.checkIfUserExistsByUsername = async (username) => {
    const { count, rows } = await User.findAndCountAll({
        where: {
            username,
        },
    });

    return count > 0;
};

module.exports = userService;
