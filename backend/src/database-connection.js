const { Sequelize } = require('sequelize');
const logger = require('./logger-factory').get('db');
const {
    DB_CONNECTION_STRING,
    DB_LOG_SQL_TO_OUTPUT_ENABLED,
} = require('./config');

const sequelize = new Sequelize(DB_CONNECTION_STRING, {
    pool: {
        max: 8,
        min: 0,
        acquire: 10000,
        idle: 10000,
    },
    logging: DB_LOG_SQL_TO_OUTPUT_ENABLED,
});

sequelize
    .authenticate()
    .then(() => {
        logger.info('Database connection has been established successfully.');
    })
    .catch((error) => {
        logger.error('Unable to connect to the database: ', error);
    });

module.exports = sequelize;
