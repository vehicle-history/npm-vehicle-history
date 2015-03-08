var options = require('config');
var assert = require('assert-plus');
var vehicleHistory = require('../vehicleHistory');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;
var SearchCarRequestBuilder = require('vehicle-history-model').model.searchCarRequest.SearchCarRequestBuilder;
var keen = require('../keen');

exports.checkVehicleHistoryV1 = function (req, res, next) {

  try {
    assert.string(req.params.plate, 'plate');
  }
  catch (e) {
    return next(new BadRequestError(e.message));
  }

  var plate = req.params.plate;
  var vin = req.params.vin;
  var firstRegistrationDate = req.params.firstRegistrationDate;
  var country = req.params.country;

  var searchCarRequest = new SearchCarRequestBuilder()
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
    return next();

    keen.vehicleEvent(req.authorization.bearer, searchCarRequest, response);
  });
};

module.exports = exports;