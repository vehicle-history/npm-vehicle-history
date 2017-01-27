'use strict';

const assert = require('assert-plus');
var webProvider = require('vehicle-history-provider-web');
const plNumberPlates = require('pl-numberplates');
const logger = require('../logger/logger').logger;

const isValidPlate = function isValidPlate(plate, callback) {
  const valid = plNumberPlates.isValid(plate);
  return callback(null, valid);
};

const getCountry = function getCountry() {
  return 'PL';
};

const validateParams = function validateParams(searchCarRequest) {
  assert.string(searchCarRequest.vin, 'searchCarRequest.vin');
  assert.string(searchCarRequest.firstRegistrationDate, 'searchCarRequest.firstRegistrationDate');
};

const checkVehicleHistory = function checkVehicleHistory(searchCarRequest, options, callback) {
  logger.debug('webProvider.checkVehicleHistory for plate: "%s"', searchCarRequest.plate);

  const opts = options.get('providers.pl');
  opts.resolver = options.get('resolver');

  return webProvider.checkVehicleHistory(searchCarRequest, opts, callback);
};

module.exports = {
  isValidPlate: isValidPlate,
  getCountry: getCountry,
  validateParams: validateParams,
  checkVehicleHistory: checkVehicleHistory
};
