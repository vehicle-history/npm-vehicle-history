var options = require('config');
var chai = require('chai');
var rewire = require('rewire');
var SearchCarRequestBuilder = require('vehicle-history-model').model.searchCarRequest.SearchCarRequestBuilder;
var provider = rewire('../../lib/provider/ukProvider');
var should = chai.should();
var expect = chai.expect;

describe('uk provider test', function () {

  it('should validate plate for uk', function (done) {

    var plate = 'A123 STE';

    provider.isValidPlate(plate, function (err, isValid) {
      expect(isValid, plate + ' should be valid').is.true;
      done();
    });
  });

  it('should call checkVehicleHistory for uk', function (done) {

    var plate = 'A123 STE';
    var vin = 'ABC123456789DEF';
    var firstRegistrationDate = 'dd.mm.rrrr';
    var country = 'UK';

    var searchCarRequest = new SearchCarRequestBuilder()
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

    provider.checkVehicleHistory(searchCarRequest, options, function (err, report) {
      should.not.exist(err);
      should.exist(report);
      done();
    });
  });
});