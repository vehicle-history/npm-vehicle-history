'use strict';

const keen = require('./keen');
const meta = require('./meta');
const example = require('./example');
const moment = require('moment');
const logger = require('./logger/logger').logger;
var provider = require('./provider/provider');
const busPlProvider = require('./provider/busPlProvider');
const myRestifyApi = require('my-restify-api');
const vehicleHistoryModel = require('vehicle-history-model');
const LocationBuilder = vehicleHistoryModel.model.location.LocationBuilder;
const MileageBuilder = vehicleHistoryModel.model.mileage.MileageBuilder;
const responseBuilder = vehicleHistoryModel.builder.responseBuilder;
const EventEnum = vehicleHistoryModel.enum.eventEnum.EventEnum;
const MileageEnum = vehicleHistoryModel.enum.mileageEnum.MileageEnum;
const Kind = vehicleHistoryModel.enum.variantEnum.VariantEnum.Kind;
const VehicleNotFoundError = vehicleHistoryModel.error.VehicleNotFoundError;
const BadRequestError = myRestifyApi.error.BadRequestError;

const checkVehicleHistory = function checkVehicleHistory(searchCarRequest, options, callback) {
  logger.debug('checkCarHistory: ', searchCarRequest);

  try {
    return provider.selectProvider(searchCarRequest.plate, (err, carDataProvider) => {

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

      return carDataProvider.checkVehicleHistory(searchCarRequest, options, (checkErr, updatedMap) => {
        if (checkErr) {
          logger.error('unable to resolve data:', checkErr);
          return callback(checkErr);
        }

        return responseBuilder.build(updatedMap, options, (buildErr, report) => {
          if (buildErr) {
            logger.error('unable to generate report by responseBuilder:', buildErr);
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

const createInspectionEvent = function createInspectionEvent(updatedMap) {

  if (!updatedMap.hasOwnProperty('inspection.createdAt') || !updatedMap['inspection.createdAt']) {
    logger.warn('unable to createInspectionEvent:', updatedMap);
    return null;
  }

  const createdAt = moment(updatedMap['inspection.createdAt'], 'DD.MM.YYYY').seconds(0).minutes(0).hours(0);
  const expiredAt = moment(createdAt).add(1, 'year');
  let mileage = null;

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

const createRegistrationEvent = function createRegistrationEvent(updatedMap) {
  if (!updatedMap.hasOwnProperty('registration.createdAt') || !updatedMap['registration.createdAt']) {
    logger.warn('unable to createRegistrationEvent:', updatedMap);
    return null;
  }

  const createdAt = moment(updatedMap['registration.createdAt'], 'DD.MM.YYYY').seconds(0).minutes(0).hours(0);
  const expiredAt = moment(createdAt).add(1, 'year');

  const location = new LocationBuilder()
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

const getBusReport = function getBusReport(searchCarRequest, options, callback) {
  logger.debug('getBusReport: ', searchCarRequest);

  if (example.isExampleBusPlate(searchCarRequest.plate, options)) {
    logger.info('Return example bus data for plate: "%s"', searchCarRequest.plate);
    keen.exampleBusEvent(searchCarRequest);
    return example.getBusExampleReportV1(options, callback);
  }

  try {
    return busPlProvider.isValidPlate(searchCarRequest.plate, (err, valid) => {

      if (err) {
        logger.info('Failed to validate bus plate for: "%s"', searchCarRequest.plate);
        return callback(err);
      }

      if (!valid) {
        logger.debug('Unable to select provider for plate "%s"', searchCarRequest.plate);
        return callback(new VehicleNotFoundError('Bus not found'));
      }

      searchCarRequest.country = busPlProvider.getCountry();

      return busPlProvider.checkVehicleHistory(searchCarRequest, options, (checkErr, updatedMap) => {
        if (checkErr) {
          logger.error('unable to resolve data: ', checkErr);
          return callback(checkErr);
        }

        if (updatedMap.hasOwnProperty('name.model') && updatedMap['name.model']) {
          updatedMap['name.model'] = updatedMap['name.model'].replace(',', '').trim();
        }

        updatedMap['vin.value'] = updatedMap.vin || null;
        updatedMap['variant.kind'] = Kind.CITY;
        updatedMap['status.stolen'] = null;

        const events = [];
        events.push(createRegistrationEvent(updatedMap));
        events.push(createInspectionEvent(updatedMap));
        updatedMap.events = events;

        return responseBuilder.build(updatedMap, options, (buildErr, report) => {
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