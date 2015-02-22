var assert = require('assert-plus');
var webProvider = require('vehicle-history-provider-web');
var plNumberPlates = require('pl-numberplates');
var logger = require('../logger/logger').logger;

var exports = {};

exports.isValidPlate = function (plate, callback) {
  var valid = plNumberPlates.isValid(plate);
  return callback(null, valid);
};

exports.getCountry = function () {
  return 'PL';
};

exports.validateParams = function (searchCarRequest) {
  assert.string(searchCarRequest.vin, 'searchCarRequest.vin');
  assert.string(searchCarRequest.firstRegistrationDate, 'searchCarRequest.firstRegistrationDate');
};

exports.checkVehicleHistory = function (searchCarRequest, options, callback) {
  logger.debug('webProvider.checkVehicleHistory for plate: "%s"', searchCarRequest.plate);

  var opts = options.get('providers.pl');
  opts.resolver = options.get('resolver');

  return webProvider.checkVehicleHistory(searchCarRequest, opts, callback);
};

module.exports = exports;
