var Keen = require('keen-js');
var config = require('config');
var extend = require('util')._extend;
var logger = require('./logger/logger').logger;

var client = new Keen(config.keen);

var errorEvent = function errorEvent(auth, searchCarRequest, err) {
  logger.debug('save errorEvent:', err);

  var event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchCarRequest: searchCarRequest,
      auth: auth
    }, err);

  client.addEvent('errorEvent', event, function (err) {
    if (err) {
      logger.warn('errorEvent save err:', err);
    }
  });
};

var vehicleEvent = function vehicleEvent(auth, searchCarRequest, vehicleEvent) {
  logger.debug('save vehicleEvent:', vehicleEvent);

  var event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchCarRequest: searchCarRequest,
      auth: auth
    }, vehicleEvent);

  client.addEvent('vehicleEvents', event, function (err) {
    if (err) {
      logger.warn('vehicleEvent save err:', err);
    }
  });
};

var busEvent = function busEvent(auth, searchCarRequest, vehicleEvent) {
  logger.debug('save busEvent:', vehicleEvent);

  var event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchCarRequest: searchCarRequest,
      auth: auth
    }, vehicleEvent);

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