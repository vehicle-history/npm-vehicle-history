var xmlProvider = require('vehicle-history-provider-xml');
var ukNumberPlates = require('uk-numberplates');
var logger = require('../logger/logger').logger;

var exports = {};

exports.isValidPlate = function (plate, callback) {
  ukNumberPlates.validate(plate, function (err/*, res*/) {
    return callback(null, err ? false : true);
  });
};

exports.validateParams = function (vin, firstRegistrationDate) {

};

exports.checkVehicleHistory = function (plate, vin, firstRegistrationDate, options, callback) {
  logger.debug('ukProvider.checkVehicleHistory for plate: "%s"', plate);

  var opts = options.get('providers.uk');
  opts.resolver = options.get('resolver');

  return xmlProvider.checkVehicleHistory(plate, vin, firstRegistrationDate, opts, callback);
};

module.exports = exports;
