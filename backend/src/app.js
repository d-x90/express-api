const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const routes = require('./routes');
const middlewares = require('./middlewares');

const app = express();
const PORT = process.env.PORT || 8000;
const applicationName = process.env.APPLICATION_NAME || 'example app';

app.use(
    morgan('common', {
        stream: fs.createWriteStream(path.join(__dirname, '..', 'access.log'), {
            flags: 'a',
        }),
    })
);
app.use(helmet());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || '*',
    })
);
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({
        message: `${applicationName} api`,
    });
});

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

app.listen(PORT, () => {
    console.log(`${applicationName} started listening on port ${PORT}`);
});
