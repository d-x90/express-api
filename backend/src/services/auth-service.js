const jwt = require('jsonwebtoken');
const userService = require('./user-service');
const logger = require('../logger').get('auth-service');
const bcrypt = require('bcrypt');

const authService = {};

const { JWT_SIGN_KEY, JWT_EXPIRATION } = require('../config');

const getJwtTokenForUser = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
    };

    return jwt.sign({ ...payload }, JWT_SIGN_KEY, {
        expiresIn: JWT_EXPIRATION,
    });
};

authService.register = async (newUser) => {
    if (await userService.checkIfUserExistsByEmail(newUser.email)) {
        const message = `User with email: '${newUser.email}' already exists`;
        logger.info(message);
        throw new Error(message);
    }
    if (await userService.checkIfUserExistsByUsername(newUser.username)) {
        const message = `User with username: '${newUser.username}' already exists`;
        logger.info(message);
        throw new Error(message);
    }

    newUser.password = await bcrypt.hash(newUser.password, 10);

    const savedUser = await userService.createUser(newUser);
    const token = getJwtTokenForUser(savedUser);

    logger.info(`User with email '${savedUser.email}' created successfully.`);

    return { user: savedUser, token };
};

authService.login = async (usernameOrEmail, password) => {
    const user = await userService.getUserByUsernameOrEmail(usernameOrEmail);

    if (!user) {
        logger.info(`User not found. usernameOrEmail: '${usernameOrEmail}'`);
        throw new Error('User not found');
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = getJwtTokenForUser(user);

        logger.info(`JWT token created for user '${user.email}'.`);

        return {
            user,
            token,
        };
    } else {
        logger.info(
            `Invalid credentials for usernameOrEmail: '${usernameOrEmail}'`
        );
        throw new Error('Invalid credentials');
    }
};

module.exports = authService;
