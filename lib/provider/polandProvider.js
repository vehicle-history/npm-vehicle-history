var polandProvider = require('vehicle-history-provider-pl');
var logger = require('../logger/logger').logger;

var exports = {};

exports.isValidPlate = function (plate) {
  return /^[a-zA-Z]{3}[ -]?\d{2}[a-zA-Z]{2}$/.test(plate) ||
    /^[a-zA-Z]{3}[ -]?[a-zA-Z0-9]{4}$/.test(plate) ||
    /^[a-zA-Z]\d[ -]?[a-zA-Z0-9]{4,5}$/.test(plate);

};

exports.checkVehicleHistory = function (plate, vin, firstRegistrationDate, options, callback) {
  logger.debug('polandProvider.checkVehicleHistory for plate: "%s"', plate);
  return polandProvider.checkVehicleHistory(plate, vin, firstRegistrationDate, options, callback);
};

module.exports = exports;
