var options = require('config');
var assert = require('assert-plus');
var myRestifyApi = require('my-restify-api');
var vehicleHistory = require('../vehicleHistory');
var BadRequestError = myRestifyApi.error.BadRequestError;

exports.checkVehicleHistoryV1 = function (req, res, next) {

  try {
    assert.string(req.params.plate, 'plate');
    assert.string(req.params.vin, 'vin');
    assert.string(req.params.firstRegistrationDate, 'firstRegistrationDate');
  }
  catch (e) {
    return next(new BadRequestError(e.message));
  }

  var plate = req.params.plate;
  var vin = req.params.vin;
  var firstRegistrationDate = req.params.firstRegistrationDate;

  vehicleHistory.checkVehicleHistory(plate, vin, firstRegistrationDate, options, function (err, response) {
    if (err) {
      return next.ifError(err);
    }

    res.send(response);
  });
};