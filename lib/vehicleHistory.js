var meta = require('./meta');
var logger = require('./logger/logger').logger;
var provider = require('./provider/provider');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;

var exports = {};

exports.checkVehicleHistory = function (searchCarRequest, options, callback) {
  logger.debug('checkCarHistory: ', searchCarRequest);

  try {
    provider.selectProvider(searchCarRequest.plate, function (err, carDataProvider) {

      if (err) {
        logger.debug('checkCarHistory: Unable to select provider for plate "%s"', plate);
        return callback(err);
      }

      try {
        carDataProvider.validateParams(searchCarRequest);
      }
      catch (e) {
        return callback(new BadRequestError(e.message));
      }

      searchCarRequest.country = carDataProvider.getCountry();

      return carDataProvider.checkVehicleHistory(searchCarRequest, options, callback);
    });
  }
  catch (e) {
    logger.warn('checkCarHistory: unable to get car data from provider for plate: "%s".', searchCarRequest.plate, e);
    return callback(e);
  }
};

exports.VERSION = meta.VERSION;
module.exports = exports;