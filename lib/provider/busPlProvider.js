'use strict';

const webProvider = require('vehicle-history-provider-web');
const plNumberPlates = require('pl-numberplates');
const logger = require('../logger/logger').logger;

const isValidPlate = function isValidPlate(plate, callback) {
  const valid = plNumberPlates.isValid(plate);
  return callback(null, valid);
};

const getCountry = function getCountry() {
  return 'PL';
};

const validateParams = function validateParams(/*searchCarRequest*/) {
};

const checkVehicleHistory = function checkVehicleHistory(searchCarRequest, options, callback) {
  logger.debug('webProvider.checkVehicleHistory for plate: "%s"', searchCarRequest.plate);

  const opts = options.get('providers.bus-pl');
  opts.resolver = options.get('resolver');

  return webProvider.checkVehicleHistory(searchCarRequest, opts, callback);
};

module.exports = {
  isValidPlate: isValidPlate,
  getCountry: getCountry,
  validateParams: validateParams,
  checkVehicleHistory: checkVehicleHistory
};
