var options = require('config');
var rewire = require('rewire');
var vehicleHistory = rewire('../lib/vehicleHistory');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('vehicle history test', function () {

  vehicleHistory.__set__({
    provider: {
      selectProvider: function (plate, callback) {
        plate.should.equal('pwr 17wq');

        return callback(null, {
          checkVehicleHistory: function (plate, vin, firstRegistrationDate, options, cb) {
            plate.should.equal('pwr 17wq');
            vin.should.equal('ABC123456789DEF');
            firstRegistrationDate.should.equal('11.11.2000');

            return cb(null, {});
          },
          validateParams: function (vin, firstRegistrationDate) {
            vin.should.equal('ABC123456789DEF');
            firstRegistrationDate.should.equal('11.11.2000');

            return true;
          }
        });
      }
    }
  });

  it('should call checkVehicleHistory ', function (done) {

    var plate = 'pwr 17wq';
    var vin = 'ABC123456789DEF';
    var firstRegistrationDate = '11.11.2000';

    vehicleHistory.checkVehicleHistory(plate, vin, firstRegistrationDate, options, function (err, result) {
      should.not.exist(err);
      should.exist(result);
      done();
    });
  });


  it('should export meta version', function (done) {

    var version = vehicleHistory.VERSION;
    should.exist(version);
    done();
  });

});
