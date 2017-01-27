'use strict';

//require('newrelic');
const app = require('./lib/app');
const logger = require('./lib/logger/logger').logger;

app.startServer((err, port) => {

  if (err) {
    logger.debug('startServer err:', err);
    throw err;
  }

  logger.debug('Server started on port: %d', port);
});