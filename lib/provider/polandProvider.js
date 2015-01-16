var webProvider = require('vehicle-history-provider-web');
var polandNumberPlates = require('pl-numberplates');
var logger = require('../logger/logger').logger;

var exports = {};

exports.isValidPlate = function (plate) {
  return polandNumberPlates.isValid(plate);
};

exports.checkVehicleHistory = function (plate, vin, firstRegistrationDate, options, callback) {
  logger.debug('polandProvider.checkVehicleHistory for plate: "%s"', plate);
  return webProvider.checkVehicleHistory(plate, vin, firstRegistrationDate, options, callback);
};

module.exports = exports;
