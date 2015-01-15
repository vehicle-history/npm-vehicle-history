var index = require('../index');
var options = require('config');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('index test', function () {

  it('should validate plates', function (done) {

    var plate = 'pwr 17wq';
    var vin = 'ABC123456789DEF';
    var firstRegistrationDate = '11.11.2000';

    index.checkVehicleHistory(plate, vin, firstRegistrationDate, options, function (err, res) {
      console.log(err);
      console.log(res);
//      expect(response, plate + ' should be ' + expected).to.be[expected];
      done();
    });
  });
});