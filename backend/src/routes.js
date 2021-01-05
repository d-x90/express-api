const routes = require('express').Router();

const userRoutes = require('./controllers/user-controller');
const authRoutes = require('./controllers/auth-controller');

routes.use('/v1/user', userRoutes);
routes.use('/v1/auth', authRoutes);

module.exports = routes;
