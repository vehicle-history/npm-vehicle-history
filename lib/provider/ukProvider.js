var xmlProvider = require('vehicle-history-provider-xml');
var ukNumberPlates = require('uk-numberplates');
var logger = require('../logger/logger').logger;

var exports = {};

exports.isValidPlate = function (plate, callback) {
  ukNumberPlates.validate(plate, function (err/*, res*/) {
    return callback(null, err ? false : true);
  });
};

exports.getCountry = function () {
  return 'UK';
};

exports.validateParams = function (searchCarRequest) {

};

exports.checkVehicleHistory = function (searchCarRequest, options, callback) {
  logger.debug('ukProvider.checkVehicleHistory for plate: "%s"', searchCarRequest.plate);

  var opts = options.get('providers.uk');
  opts.resolver = options.get('resolver');

  return xmlProvider.checkVehicleHistory(searchCarRequest, opts, callback);
};

module.exports = exports;
