'use strict';

var Keen = require('keen-js');
var config = require('config');
var extend = require('util')._extend;
var logger = require('./logger/logger').logger;

var client = new Keen(config.keen);

var errorEvent = function errorEvent(auth, searchCarRequest, error) {
  logger.debug('save errorEvent:', error);

  var event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchCarRequest: searchCarRequest,
      auth: auth
    }, error);

  client.addEvent('errorEvent', event, function (err) {
    if (err) {
      logger.warn('errorEvent save err:', err);
    }
  });
};

var vehicleEvent = function vehicleEvent(auth, searchCarRequest, eventData) {
  logger.debug('save vehicleEvent:', eventData);

  var event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchCarRequest: searchCarRequest,
      auth: auth
    }, eventData);

  client.addEvent('vehicleEvents', event, function (err) {
    if (err) {
      logger.warn('vehicleEvent save err:', err);
    }
  });
};

var busEvent = function busEvent(auth, searchCarRequest, eventData) {
  logger.debug('save busEvent:', eventData);

  var event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchCarRequest: searchCarRequest,
      auth: auth
    }, eventData);

  client.addEvent('busEvent', event, function (err) {
    if (err) {
      logger.warn('busEvent save err:', err);
    }
  });
};

module.exports = {
  errorEvent: errorEvent,
  vehicleEvent: vehicleEvent,
  busEvent: busEvent
};
