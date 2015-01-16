var rewire = require('rewire');
var index = rewire('../index');
var options = require('config');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('index test', function () {

  index.__set__({
    provider: {
      selectProvider: function (plate) {
        plate.should.equal('pwr 17wq');

        return {
          checkVehicleHistory: function (plate, vin, firstRegistrationDate, options, callback) {
            plate.should.equal('pwr 17wq');
            vin.should.equal('ABC123456789DEF');
            firstRegistrationDate.should.equal('11.11.2000');

            return callback(null, {});
          }
        };
      }
    }
  });

  it('should call checkVehicleHistory ', function (done) {

    var plate = 'pwr 17wq';
    var vin = 'ABC123456789DEF';
    var firstRegistrationDate = '11.11.2000';

    index.checkVehicleHistory(plate, vin, firstRegistrationDate, options, function (err, result) {
      should.not.exist(err);
      should.exist(result);
      done();
    });
  });


  it('should export meta version', function (done) {

    var version = index.VERSION;
    should.exist(version);
    done();
  });

});