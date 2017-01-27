'use strict';

var xmlProvider = require('vehicle-history-provider-xml');
const ukNumberPlates = require('uk-numberplates');
const logger = require('../logger/logger').logger;

const isValidPlate = function isValidPlate(plate, callback) {
  ukNumberPlates.validate(plate, err => callback(null, err ? false : true));
};

const getCountry = function getCountry() {
  return 'UK';
};

const validateParams = function validateParams(/*searchCarRequest*/) {

};

const checkVehicleHistory = function checkVehicleHistory(searchCarRequest, options, callback) {
  logger.debug('ukProvider.checkVehicleHistory for plate: "%s"', searchCarRequest.plate);

  const opts = options.get('providers.uk');
  opts.resolver = options.get('resolver');

  return xmlProvider.checkVehicleHistory(searchCarRequest, opts, callback);
};

module.exports = {
  isValidPlate: isValidPlate,
  getCountry: getCountry,
  validateParams: validateParams,
  checkVehicleHistory: checkVehicleHistory
};
