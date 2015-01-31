var options = require('config');
var assert = require('assert-plus');
var vehicleHistory = require('../vehicleHistory');
var myRestifyApi = require('my-restify-api');
var BadRequestError = myRestifyApi.error.BadRequestError;

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

  vehicleHistory.checkVehicleHistory(plate, vin, firstRegistrationDate, options, function (err, response) {
    if (err) {
      return next.ifError(err);
    }

    res.send(response);
  });
};