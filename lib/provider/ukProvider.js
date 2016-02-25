'use strict';

var xmlProvider = require('vehicle-history-provider-xml');
var ukNumberPlates = require('uk-numberplates');
var logger = require('../logger/logger').logger;

var isValidPlate = function isValidPlate(plate, callback) {
  ukNumberPlates.validate(plate, function (err/*, res*/) {
    return callback(null, err ? false : true);
  });
};

var getCountry = function getCountry() {
  return 'UK';
};

var validateParams = function validateParams(/*searchCarRequest*/) {

};

var checkVehicleHistory = function checkVehicleHistory(searchCarRequest, options, callback) {
  logger.debug('ukProvider.checkVehicleHistory for plate: "%s"', searchCarRequest.plate);

  var opts = options.get('providers.uk');
  opts.resolver = options.get('resolver');

  return xmlProvider.checkVehicleHistory(searchCarRequest, opts, callback);
};

module.exports = {
  isValidPlate: isValidPlate,
  getCountry: getCountry,
  validateParams: validateParams,
  checkVehicleHistory: checkVehicleHistory
};
