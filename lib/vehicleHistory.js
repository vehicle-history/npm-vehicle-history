'use strict';

var keen = require('./keen');
var meta = require('./meta');
var example = require('./example');
var moment = require('moment');
var logger = require('./logger/logger').logger;
var provider = require('./provider/provider');
var busPlProvider = require('./provider/busPlProvider');
var myRestifyApi = require('my-restify-api');
var vehicleHistoryModel = require('vehicle-history-model');
var LocationBuilder = vehicleHistoryModel.model.location.LocationBuilder;
var MileageBuilder = vehicleHistoryModel.model.mileage.MileageBuilder;
var responseBuilder = vehicleHistoryModel.builder.responseBuilder;
var EventEnum = vehicleHistoryModel.enum.eventEnum.EventEnum;
var MileageEnum = vehicleHistoryModel.enum.mileageEnum.MileageEnum;
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

      return carDataProvider.checkVehicleHistory(searchCarRequest, options, function (checkErr, updatedMap) {
        if (checkErr) {
          logger.error('unable to resolve data: %s', checkErr);
          return callback(checkErr);
        }

        responseBuilder.build(updatedMap, options, function (buildErr, report) {
          if (buildErr) {
            logger.error('unable to generate report by responseBuilder: %s', buildErr);
            return callback(buildErr);
          }

          return callback(buildErr, report);
        });
      });
    });
  }
  catch (e) {
    logger.warn('unable to get car data from provider for plate: "%s".', searchCarRequest.plate, e);
    return callback(e);
  }
};

var createInspectionEvent = function createInspectionEvent(updatedMap) {

  if (!updatedMap.hasOwnProperty('inspection.createdAt') || !updatedMap['inspection.createdAt']) {
    logger.warn('unable to createInspectionEvent:', updatedMap);
    return null;
  }

  var createdAt = moment(updatedMap['inspection.createdAt'], 'DD.MM.YYYY').seconds(0).minutes(0).hours(0);
  var expiredAt = moment(createdAt).add(1, 'year');
  var mileage = null;

  if (updatedMap.hasOwnProperty('mileage.value')) {
    mileage = new MileageBuilder()
      .withValue(updatedMap['mileage.value'])
      .withType(MileageEnum.Type.KM)
      .build();
  }

  return {
    type: EventEnum.INSPECTION,
    createdAt: createdAt.toISOString(),
    expireAt: expiredAt.toISOString(),
    description: 'Data wykonania ostatniego badania technicznego',
    mileage: mileage
  };
};

var createRegistrationEvent = function createRegistrationEvent(updatedMap) {
  if (!updatedMap.hasOwnProperty('registration.createdAt') || !updatedMap['registration.createdAt']) {
    logger.warn('unable to createRegistrationEvent:', updatedMap);
    return null;
  }

  var createdAt = moment(updatedMap['registration.createdAt'], 'DD.MM.YYYY').seconds(0).minutes(0).hours(0);
  var expiredAt = moment(createdAt).add(1, 'year');

  var location = new LocationBuilder()
    .withState(updatedMap['registration.location.state'])
    .withCountry('PL')
    .build();

  return {
    type: EventEnum.CHANGED_REGISTRATION_LOCATION,
    createdAt: createdAt.toISOString(),
    expireAt: expiredAt.toISOString(),
    description: 'Wydanie aktualnego dowodu rejestracyjnego',
    location: location
  };
};

var getBusReport = function getBusReport(searchCarRequest, options, callback) {
  logger.debug('getBusReport: ', searchCarRequest);

  if (example.isExampleBusPlate(searchCarRequest.plate, options)) {
    logger.info('Return example bus data for plate: "%s"', searchCarRequest.plate);
    keen.exampleBusEvent(searchCarRequest);
    return example.getBusExampleReportV1(options, callback);
  }

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

      return busPlProvider.checkVehicleHistory(searchCarRequest, options, function (checkErr, updatedMap) {
        if (checkErr) {
          logger.error('unable to resolve data', checkErr);
          return callback(checkErr);
        }

        if (updatedMap.hasOwnProperty('name.model') && updatedMap['name.model']) {
          updatedMap['name.model'] = updatedMap['name.model'].replace(',', '').trim();
        }

        updatedMap['vin.value'] = updatedMap.vin || null;
        updatedMap['variant.kind'] = Kind.CITY;
        updatedMap['status.stolen'] = null;

        var events = [];
        events.push(createRegistrationEvent(updatedMap));
        events.push(createInspectionEvent(updatedMap));
        updatedMap.events = events;

        responseBuilder.build(updatedMap, options, function (buildErr, report) {
          if (buildErr) {
            logger.error('unable to generate report by responseBuilder: %s', buildErr);
            return callback(buildErr);
          }

          return callback(buildErr, report);
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