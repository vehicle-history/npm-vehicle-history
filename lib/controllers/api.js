var options = require('config');
var vehicleHistory = require('../vehicleHistory');
var assert = require('assert-plus');
//var BadRequestError = require('../error/badRequestError').BadRequestError;

exports.checkVehicleHistoryV1 = function (req, res, next) {

  try {
    assert.string(req.params.plate, 'plate');
    assert.string(req.params.vin, 'vin');
    assert.string(req.params.firstRegistrationDate, 'firstRegistrationDate');
  }
  catch (e) {
//    return next(new BadRequestError(e.message));
  }

  var plate = req.params.plate;
  var vin = req.params.vin;
  var firstRegistrationDate = req.params.firstRegistrationDate;

  vehicleHistory.checkVehicleHistory(plate, vin, firstRegistrationDate, options, function (err, response) {
    next.ifError(err);
    res.send(response);
  });
};