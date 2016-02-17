var meta = require('./meta');
var logger = require('./logger/logger').logger;
var provider = require('./provider/provider');
var busPlProvider = require('./provider/busPlProvider');
var myRestifyApi = require('my-restify-api');
var vehicleHistoryModel = require('vehicle-history-model');
var LocationBuilder = vehicleHistoryModel.model.location.LocationBuilder;
var responseBuilder = vehicleHistoryModel.builder.responseBuilder;
var EventEnum = vehicleHistoryModel.enum.eventEnum.EventEnum;
var Kind = vehicleHistoryModel.enum.variantEnum.VariantEnum.Kind;
var VehicleNotFoundError = vehicleHistoryModel.error.VehicleNotFoundError;
var BadRequestError = myRestifyApi.error.BadRequestError;

var checkVehicleHistory = function checkVehicleHistory(searchCarRequest, options, callback) {
  logger.debug('checkCarHistory: ', searchCarRequest);

  try {
    provider.selectProvider(searchCarRequest.plate, function (err, carDataProvider) {

      if (err) {
        logger.debug('Unable to select provider for plate "%s"', searchCarRequest.plate);
        return callback(err);
      }

      try {
        carDataProvider.validateParams(searchCarRequest);
      }
      catch (e) {
        return callback(new BadRequestError(e.message));
      }

      searchCarRequest.country = carDataProvider.getCountry();

      return carDataProvider.checkVehicleHistory(searchCarRequest, options, function (err, updatedMap) {
        if (err) {
          logger.error('unable to resolve data: %s', err);
          return callback(err);
        }

        responseBuilder.build(updatedMap, options, function (err, report) {
          if (err) {
            logger.error('unable to generate report by responseBuilder: %s', err);
            return callback(err);
          }

          return callback(err, report);
        });
      });
    });
  }
  catch (e) {
    logger.warn('unable to get car data from provider for plate: "%s".', searchCarRequest.plate, e);
    return callback(e);
  }
};

var getBusReport = function getBusReport(searchCarRequest, options, callback) {
  logger.debug('getBusReport: ', searchCarRequest);

  try {
    busPlProvider.isValidPlate(searchCarRequest.plate, function (err, valid) {

      if (err) {
        logger.info('Failed to validate bus plate for: "%s"', searchCarRequest.plate);
        return callback(err);
      }

      if (!valid) {
        logger.debug('Unable to select provider for plate "%s"', searchCarRequest.plate);
        return callback(new VehicleNotFoundError('Bus not found'));
      }

      searchCarRequest.country = busPlProvider.getCountry();

      return busPlProvider.checkVehicleHistory(searchCarRequest, options, function (err, updatedMap) {
        if (err) {
          logger.error('unable to resolve data', err);
          return callback(err);
        }

        updatedMap['name.model'] = updatedMap['name.model'].replace(',', '').trim() || null;
        updatedMap['vin.value'] = updatedMap['vin'] || null;
        updatedMap['variant.kind'] = Kind.CITY;  //TODO


        //console.log(updatedMap);

        var createdAt = updatedMap['inspection.createdAt'];

        var events = [];
        events.push({
          type: EventEnum.INSPECTION,
          createdAt: createdAt,
          expireAt: createdAt,
          description: 'Data wykonania ostatniego badania technicznego',
          mileage: updatedMap['mileage.value']
        });

        createdAt = updatedMap['registration.createdAt'];

        var location = new LocationBuilder()
          .withState(updatedMap['registration.location.state'])
          .withCountry('PL')  //TODO
          .build();

        events.push({
          type: EventEnum.CHANGED_REGISTRATION_LOCATION,
          createdAt: createdAt,
          expireAt: createdAt,
          description: 'Wydanie aktualnego dowodu rejestracyjnego',
          location: location
        });

        updatedMap['events'] = events;


        console.log(updatedMap);


        responseBuilder.build(updatedMap, options, function (err, report) {
          if (err) {
            logger.error('unable to generate report by responseBuilder: %s', err);
            return callback(err);
          }

          return callback(err, report);
        });
      });
    });
  }
  catch (e) {
    logger.warn('unable to get bus data from provider for plate: "%s".', searchCarRequest.plate, e);
    return callback(e);
  }
};

module.exports = {
  checkVehicleHistory: checkVehicleHistory,
  getBusReport: getBusReport,
  VERSION: meta.VERSION
};