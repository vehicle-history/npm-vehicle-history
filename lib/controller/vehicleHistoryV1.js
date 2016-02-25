'use strict';

var options = require('config');
var assert = require('assert-plus');
var vehicleHistory = require('../vehicleHistory');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var vehicleHistoryModel = require('vehicle-history-model');
var SearchCarRequestBuilder = vehicleHistoryModel.model.searchCarRequest.SearchCarRequestBuilder;
var VehicleReportsCollectionBuilder = vehicleHistoryModel.model.vehicleReportsCollection.VehicleReportsCollectionBuilder;
var keen = require('../keen');

var checkVehicleHistoryV1 = function checkVehicleHistoryV1(req, res, next) {

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

  return vehicleHistory.checkVehicleHistory(searchCarRequest, options, function (err, report) {

    if (err) {
      keen.errorEvent(req.authorization.bearer, searchCarRequest, err);
    }

    next.ifError(err);
    res.send(200, report);
    next();

    return keen.vehicleEvent(req.authorization.bearer, searchCarRequest, report);
  });
};

var getVehicleReportsV1 = function getVehicleReportsV1(req, res, next) {

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

  return vehicleHistory.checkVehicleHistory(searchCarRequest, options, function (err, report) {

    if (err) {
      keen.errorEvent(req.authorization.bearer, searchCarRequest, err);
    }

    next.ifError(err);

    var response = new VehicleReportsCollectionBuilder()
      .withCount(1)
      .withVehicleReports([report])
      .build();

    res.send(200, response);
    next();

    return keen.vehicleEvent(req.authorization.bearer, searchCarRequest, report);
  });
};

var getBusReportV1 = function getBusReportV1(req, res, next) {

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

  return vehicleHistory.getBusReport(searchCarRequest, options, function (err, report) {

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