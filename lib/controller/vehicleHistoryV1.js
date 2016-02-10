var options = require('config');
var assert = require('assert-plus');
var vehicleHistory = require('../vehicleHistory');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var vehicleHistoryModel = require('vehicle-history-model');
var SearchCarRequestBuilder = vehicleHistoryModel.model.searchCarRequest.SearchCarRequestBuilder;
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

  return vehicleHistory.checkVehicleHistory(searchCarRequest, options, function (err, response) {

    if (err) {
      keen.errorEvent(req.authorization.bearer, searchCarRequest, err);
    }

    next.ifError(err);
    res.send(200, response);
    next();

    return keen.vehicleEvent(req.authorization.bearer, searchCarRequest, response);
  });
};

module.exports = {
  checkVehicleHistoryV1: checkVehicleHistoryV1
};