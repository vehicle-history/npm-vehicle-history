var options = require('config');
var rewire = require('rewire');
var SearchCarRequestBuilder = require('vehicle-history-model').model.searchCarRequest.SearchCarRequestBuilder;
var vehicleHistory = rewire('../lib/vehicleHistory');
var chai = require('chai');
var should = chai.should();

describe('vehicle history test', function () {

  vehicleHistory.__set__({
    provider: {
      selectProvider: function (plate, callback) {
        plate.should.equal('pwr 17wq');

        return callback(null, {
          checkVehicleHistory: function (searchCarRequest, options, cb) {
            searchCarRequest.plate.should.equal('pwr 17wq');
            searchCarRequest.vin.should.equal('ABC123456789DEF');
            searchCarRequest.firstRegistrationDate.should.equal('11.11.2000');

            return cb(null, {});
          },
          validateParams: function (searchCarRequest) {
            searchCarRequest.vin.should.equal('ABC123456789DEF');
            searchCarRequest.firstRegistrationDate.should.equal('11.11.2000');

            return true;
          },
          getCountry: function () {
            return 'PL';
          }
        });
      }
    }
  });

  it('should call checkVehicleHistory ', function (done) {

    var plate = 'pwr 17wq';
    var vin = 'ABC123456789DEF';
    var firstRegistrationDate = '11.11.2000';
    var country = 'UK';

    var searchCarRequest = new SearchCarRequestBuilder()
      .withPlate(plate)
      .withVin(vin)
      .withFirstRegistrationDate(firstRegistrationDate)
      .withCountry(country)
      .build();

    vehicleHistory.checkVehicleHistory(searchCarRequest, options, function (err, result) {
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
