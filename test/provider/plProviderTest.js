const options = require('config');
const chai = require('chai');
const rewire = require('rewire');
const SearchCarRequestBuilder = require('vehicle-history-model').model.searchCarRequest.SearchCarRequestBuilder;
const provider = rewire('../../lib/provider/plProvider');
const should = chai.should();
const expect = chai.expect;

describe('web provider test', () => {

  it('should validate plate for pl', done => {

    const plate = 'PWR 17WQ';

    provider.isValidPlate(plate, (err, isValid) => {
      expect(isValid, `${plate} should be valid`).is.true;
      done();
    });
  });

  it('should call checkVehicleHistory for pl', done => {

    const plate = 'PWR 17WQ';
    const vin = 'ABC123456789DEF';
    const firstRegistrationDate = 'dd.mm.rrrr';
    const country = 'PL';

    const searchCarRequest = new SearchCarRequestBuilder()
      .withPlate(plate)
      .withVin(vin)
      .withFirstRegistrationDate(firstRegistrationDate)
      .withCountry(country)
      .build();

    provider.__set__({
      webProvider: {
        checkVehicleHistory: function (searchCarRequest, opts, callback) {

          expect(opts).to.have.ownProperty('resolver');
          expect(opts).to.have.ownProperty('example');
          expect(opts).to.have.ownProperty('form');
          expect(opts).to.have.ownProperty('parser');

          callback(null, {});
        }
      }
    });

    provider.checkVehicleHistory(searchCarRequest, options, (err, report) => {
      should.not.exist(err);
      should.exist(report);
      done();
    });
  });
});