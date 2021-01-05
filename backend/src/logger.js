const winston = require('winston');

module.exports = {
    get: (serviceName) => {
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
