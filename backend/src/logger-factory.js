const winston = require('winston');
const { LOGGING_ENABLED } = require('./config');

module.exports = {
    get: (serviceName) => {
        if (!LOGGING_ENABLED) {
            return {
                info: () => {},
                debug: () => {},
                warn: () => {},
                error: () => {},
            };
        }

        const logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.logstash()
            ),
            defaultMeta: { serviceName },
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'combined.log' }),
            ],
        });

        return logger;
    },
};
