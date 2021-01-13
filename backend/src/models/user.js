const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database-connection');
const { USER_ROLES } = require('../enums');

const User = sequelize.define(
    'User',
    {
        id: {
            primaryKey: true,
            type: DataTypes.UUIDV4,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
        },
        username: {
            unique: true,
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            unique: true,
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM(Object.keys(USER_ROLES)),
            allowNull: false,
            defaultValue: USER_ROLES.USER,
        },
        refreshToken: {
            type: DataTypes.UUIDV4,
            allowNull: true,
        },
        jwtValidAfter: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        freezeTableName: true,
    }
);

(async () => {
    await User.sync({ alter: true });
})();

module.exports = User;
