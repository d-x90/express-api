require('dotenv').config();

const config = {
    PORT: process.env.PORT || 8080,
    APPLICATION_NAME: process.env.APPLICATION_NAME || 'example app',
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || 'sqlite::memory',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    JWT_SIGN_KEY: process.env.JWT_SIGN_KEY || 'JWT_SIGN_KEY',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
    NODE_ENV: process.env.NODE_ENV || 'development',
    PASSWORD_MIN_LENGTH: Number(process.env.PASSWORD_MIN_LENGTH) || 4,
};

module.exports = config;
