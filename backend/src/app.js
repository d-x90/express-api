const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const { PORT, APPLICATION_NAME, CORS_ORIGIN } = require('./config');
const routes = require('./routes');
const middlewares = require('./middlewares');

const app = express();

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
        origin: CORS_ORIGIN,
    })
);
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({
        message: `${APPLICATION_NAME} api`,
    });
});

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

app.listen(PORT, () => {
    console.log(`${APPLICATION_NAME} started listening on port ${PORT}`);
});
