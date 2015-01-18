var xmlProvider = require('vehicle-history-provider-xml');
var ukNumberPlates = require('uk-numberplates');
var logger = require('../logger/logger').logger;

var exports = {};

exports.isValidPlate = function (plate, callback) {
  ukNumberPlates.validate(plate, function (err, res) {
    return callback(null, err ? false : true);
  });
};

exports.checkVehicleHistory = function (plate, vin, firstRegistrationDate, options, callback) {
  logger.debug('ukProvider.checkVehicleHistory for plate: "%s"', plate);
  return xmlProvider.checkVehicleHistory(plate, vin, firstRegistrationDate, options, callback);
};

module.exports = exports;
