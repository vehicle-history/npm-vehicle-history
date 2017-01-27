'use strict';

const options = require('config');
const assert = require('assert-plus');
const vehicleHistory = require('../vehicleHistory');
const myRestifyApi = require('my-restify-api');
const BadRequestError = myRestifyApi.error.BadRequestError;
const vehicleHistoryModel = require('vehicle-history-model');
const SearchCarRequestBuilder = vehicleHistoryModel.model.searchCarRequest.SearchCarRequestBuilder;
const VehicleReportsCollectionBuilder = vehicleHistoryModel.model.vehicleReportsCollection.VehicleReportsCollectionBuilder;
const keen = require('../keen');

const checkVehicleHistoryV1 = function checkVehicleHistoryV1(req, res, next) {

  try {
    assert.string(req.params.plate, 'plate');
  }
  catch (e) {
    return next(new BadRequestError(e.message, 'Podany numer rejestracyjny jest niepoprawny', 'plate'));
  }

  const plate = req.params.plate;
  const vin = req.params.vin;
  const firstRegistrationDate = req.params.firstRegistrationDate;
  const country = req.params.country;

  const searchCarRequest = new SearchCarRequestBuilder()
    .withPlate(plate)
    .withVin(vin)
    .withFirstRegistrationDate(firstRegistrationDate)
    .withCountry(country)
    .build();

  return vehicleHistory.checkVehicleHistory(searchCarRequest, options, (err, report) => {

    if (err) {
      keen.errorEvent(req.authorization.bearer, searchCarRequest, err);
    }

    next.ifError(err);
    res.send(200, report);
    next();

    return keen.vehicleEvent(req.authorization.bearer, searchCarRequest, report);
  });
};

const getVehicleReportsV1 = function getVehicleReportsV1(req, res, next) {

  try {
    assert.string(req.params.plate, 'plate');
  }
  catch (e) {
    return next(new BadRequestError(e.message, 'Podany numer rejestracyjny jest niepoprawny', 'plate'));
  }

  const plate = req.params.plate;
  const vin = req.params.vin;
  const firstRegistrationDate = req.params.firstRegistrationDate;
  const country = req.params.country;

  const searchCarRequest = new SearchCarRequestBuilder()
    .withPlate(plate)
    .withVin(vin)
    .withFirstRegistrationDate(firstRegistrationDate)
    .withCountry(country)
    .build();

  return vehicleHistory.checkVehicleHistory(searchCarRequest, options, (err, report) => {

    if (err) {
      keen.errorEvent(req.authorization.bearer, searchCarRequest, err);
    }

    next.ifError(err);

    const response = new VehicleReportsCollectionBuilder()
      .withCount(1)
      .withVehicleReports([report])
      .build();

    res.send(200, response);
    next();

    return keen.vehicleEvent(req.authorization.bearer, searchCarRequest, report);
  });
};

const getBusReportV1 = function getBusReportV1(req, res, next) {

  try {
    assert.string(req.params.plate, 'plate');
  }
  catch (e) {
    return next(new BadRequestError(e.message, 'Podany numer rejestracyjny jest niepoprawny', 'plate'));
  }

  const plate = req.params.plate;
  const country = req.params.country;

  const searchCarRequest = new SearchCarRequestBuilder()
    .withPlate(plate)
    .withCountry(country)
    .build();

  return vehicleHistory.getBusReport(searchCarRequest, options, (err, report) => {

    if (err) {
      keen.errorEvent(req.authorization.bearer, searchCarRequest, err);
    }

    next.ifError(err);
    res.send(200, report);
    next();

    return keen.busEvent(req.authorization.bearer, searchCarRequest, report);
  });
};

module.exports = {
  checkVehicleHistoryV1: checkVehicleHistoryV1,
  getBusReportV1: getBusReportV1,
  getVehicleReportsV1: getVehicleReportsV1
};