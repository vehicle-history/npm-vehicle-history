const options = require('config');
const rewire = require('rewire');
const SearchCarRequestBuilder = require('vehicle-history-model').model.searchCarRequest.SearchCarRequestBuilder;
const vehicleHistory = rewire('../lib/vehicleHistory');
const chai = require('chai');
const should = chai.should();

describe('vehicle history test', () => {

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
          validateParams: function({vin, firstRegistrationDate}) {
            vin.should.equal('ABC123456789DEF');
            firstRegistrationDate.should.equal('11.11.2000');

            return true;
          },
          getCountry: function () {
            return 'PL';
          }
        });
      }
    }
  });

  it('should call checkVehicleHistory ', done => {

    const plate = 'pwr 17wq';
    const vin = 'ABC123456789DEF';
    const firstRegistrationDate = '11.11.2000';
    const country = 'UK';

    const searchCarRequest = new SearchCarRequestBuilder()
      .withPlate(plate)
      .withVin(vin)
      .withFirstRegistrationDate(firstRegistrationDate)
      .withCountry(country)
      .build();

    vehicleHistory.checkVehicleHistory(searchCarRequest, options, (err, result) => {
      should.not.exist(err);
      should.exist(result);
      done();
    });
  });


  it('should export meta version', done => {

    const version = vehicleHistory.VERSION;
    should.exist(version);
    done();
  });

});
