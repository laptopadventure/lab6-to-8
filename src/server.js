'use strict';

// 3rd Party Dependencies (modules)
const express = require('express');

// error handlers

const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');

// middleware

const logger = require('./middleware/logger.js');

// routes

const foodRoutes = require('./routes/food.js');
const clothesRoutes = require('./routes/clothes.js');
const signUpRoute = require('./routes/signup');
const signInRoute = require('./routes/signin');

const app = express();

// Express Global Middleware
app.use(express.json());

// Our own Global Middleware
app.use(logger);

// Use our routes from the routing module...
app.use(foodRoutes);
app.use(clothesRoutes);

// user related routes
app.use(signUpRoute);
app.use(signInRoute);

// Our Error Handlers -- need to be the last things defined!
// These use the external modules we required above
app.use('*', notFoundHandler);
app.use(errorHandler);

// Export an object with the express app and separate method that can start the server
module.exports = {
  server: app,
  start: (port) => {
    if (!port) {
      throw new Error('Missing Port');
    }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
