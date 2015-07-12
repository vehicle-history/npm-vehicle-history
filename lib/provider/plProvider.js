var assert = require('assert-plus');
var webProvider = require('vehicle-history-provider-web');
var plNumberPlates = require('pl-numberplates');
var logger = require('../logger/logger').logger;

var isValidPlate = function isValidPlate(plate, callback) {
  var valid = plNumberPlates.isValid(plate);
  return callback(null, valid);
};

var getCountry = function getCountry() {
  return 'PL';
};

var validateParams = function validateParams(searchCarRequest) {
  assert.string(searchCarRequest.vin, 'searchCarRequest.vin');
  assert.string(searchCarRequest.firstRegistrationDate, 'searchCarRequest.firstRegistrationDate');
};

var checkVehicleHistory = function checkVehicleHistory(searchCarRequest, options, callback) {
  logger.debug('webProvider.checkVehicleHistory for plate: "%s"', searchCarRequest.plate);

  var opts = options.get('providers.pl');
  opts.resolver = options.get('resolver');

  return webProvider.checkVehicleHistory(searchCarRequest, opts, callback);
};

module.exports = {
  isValidPlate: isValidPlate,
  getCountry: getCountry,
  validateParams: validateParams,
  checkVehicleHistory: checkVehicleHistory
};
