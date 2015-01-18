var webProvider = require('vehicle-history-provider-web');
var plNumberPlates = require('pl-numberplates');
var logger = require('../logger/logger').logger;

var exports = {};

exports.isValidPlate = function (plate, callback) {
  var valid = plNumberPlates.isValid(plate);
  return callback(null, valid);
};

exports.checkVehicleHistory = function (plate, vin, firstRegistrationDate, options, callback) {
  logger.debug('plProvider.checkVehicleHistory for plate: "%s"', plate);
  return webProvider.checkVehicleHistory(plate, vin, firstRegistrationDate, options, callback);
};

module.exports = exports;
