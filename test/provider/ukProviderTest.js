const options = require('config');
const chai = require('chai');
const rewire = require('rewire');
const SearchCarRequestBuilder = require('vehicle-history-model').model.searchCarRequest.SearchCarRequestBuilder;
const provider = rewire('../../lib/provider/ukProvider');
const should = chai.should();
const expect = chai.expect;

describe('uk provider test', () => {

  it('should validate plate for uk', done => {

    const plate = 'A123 STE';

    provider.isValidPlate(plate, (err, isValid) => {
      expect(isValid, `${plate} should be valid`).is.true;
      done();
    });
  });

  it('should call checkVehicleHistory for uk', done => {

    const plate = 'A123 STE';
    const vin = 'ABC123456789DEF';
    const firstRegistrationDate = 'dd.mm.rrrr';
    const country = 'UK';

    const searchCarRequest = new SearchCarRequestBuilder()
      .withPlate(plate)
      .withVin(vin)
      .withFirstRegistrationDate(firstRegistrationDate)
      .withCountry(country)
      .build();

    provider.__set__({
      xmlProvider: {
        checkVehicleHistory: function (searchCarRequest, opts, callback) {

          expect(opts).to.have.ownProperty('resolver');
          expect(opts).to.have.ownProperty('url');
          expect(opts).to.have.ownProperty('headers');
          expect(opts).to.have.ownProperty('xmlParserOptions');
          expect(opts).to.have.ownProperty('mapper');
          expect(opts).to.have.ownProperty('mapperDefaults');

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