var meta = require('./lib/meta');
var logger = require('./lib/logger/logger').logger;
var provider = require('./lib/provider/provider');

var exports = {};

exports.checkVehicleHistory = function (plate, vin, firstRegistrationDate, options, callback) {
  logger.debug('checkCarHistory: plate:' + plate + ', vin:' + vin + ', firstRegistrationDate:' + firstRegistrationDate);

  try {
    var carDataProvider = provider.selectProvider(plate);
    carDataProvider.checkVehicleHistory(plate, vin, firstRegistrationDate, options, callback);
  }
  catch (e) {
    logger.warn('checkCarHistory: unable to get car data from provider for plate: "%s"', plate);
    return callback(e);
  }
};


/**
 * the version of the library
 * @property VERSION
 * @type String
 * @static
 */
exports.VERSION = meta.VERSION;

module.exports = exports;