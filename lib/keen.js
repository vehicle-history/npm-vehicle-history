'use strict';

const Keen = require('keen-js');
const config = require('config');
const extend = require('util')._extend;
const logger = require('./logger/logger').logger;

const client = new Keen(config.keen);

const errorEvent = function errorEvent(auth, searchCarRequest, error) {
  logger.debug('save errorEvent:', error);

  const event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchCarRequest: searchCarRequest,
      auth: auth
    }, error);

  client.addEvent('errorEvent', event, err => {
    if (err) {
      logger.warn('errorEvent save err:', err);
    }
  });
};

const vehicleEvent = function vehicleEvent(auth, searchCarRequest, eventData) {
  logger.debug('save vehicleEvent:', eventData);

  const event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchCarRequest: searchCarRequest,
      auth: auth
    }, eventData);

  client.addEvent('vehicleEvents', event, err => {
    if (err) {
      logger.warn('vehicleEvent save err:', err);
    }
  });
};

const busEvent = function busEvent(auth, searchCarRequest, eventData) {
  logger.debug('save busEvent:', eventData);

  const event = extend(
    {
      keen: {
        timestamp: new Date().toISOString()
      },
      searchCarRequest: searchCarRequest,
      auth: auth
    }, eventData);

  client.addEvent('busEvent', event, err => {
    if (err) {
      logger.warn('busEvent save err:', err);
    }
  });
};

const exampleBusEvent = function exampleBusEvent(searchCarRequest) {
  logger.debug('save exampleBusEvent');

  const event = {
    keen: {
      timestamp: new Date().toISOString()
    },
    searchCarRequest: searchCarRequest,
    auth: {}
  };

  client.addEvent('exampleBusEvent', event, err => {
    if (err) {
      logger.warn('exampleBusEvent save err:', err);
    }
  });
};

module.exports = {
  errorEvent: errorEvent,
  vehicleEvent: vehicleEvent,
  busEvent: busEvent,
  exampleBusEvent: exampleBusEvent
};
