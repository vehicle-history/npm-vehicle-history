var meta = require('./meta');
var logger = require('./logger/logger').logger;
var provider = require('./provider/provider');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;

var exports = {};

exports.checkVehicleHistory = function (plate, vin, firstRegistrationDate, options, callback) {
  logger.debug('checkCarHistory: plate:' + plate + ', vin:' + vin + ', firstRegistrationDate:' + firstRegistrationDate);

  try {
    provider.selectProvider(plate, function (err, carDataProvider) {

      if (err) {
        logger.debug('checkCarHistory: Unable to select provider for plate "%s"', plate);
        return callback(err);
      }

      try {
        carDataProvider.validateParams(vin, firstRegistrationDate);
      }
      catch (e) {
        return callback(new BadRequestError(e.message));
      }

      return carDataProvider.checkVehicleHistory(plate, vin, firstRegistrationDate, options, callback);
    });
  }
  catch (e) {
    logger.warn('checkCarHistory: unable to get car data from provider for plate: "%s".', plate, e);
    return callback(e);
  }
};

exports.VERSION = meta.VERSION;
module.exports = exports;