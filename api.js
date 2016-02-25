'use strict';

//require('newrelic');
var app = require('./lib/app');
var logger = require('./lib/logger/logger').logger;

app.startServer(function (err, port) {

  if (err) {
    logger.debug('startServer err:', err);
    throw err;
  }

  logger.debug('Server started on port: %d', port);
});