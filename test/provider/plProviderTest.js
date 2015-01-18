var options = require('config');
var chai = require('chai');
var rewire = require('rewire');
var provider = rewire('../../lib/provider/plProvider');
var should = chai.should();
var expect = chai.expect;

describe('web provider test', function () {

  it('should validate plate for pl', function (done) {

    var plate = 'PWR 17WQ';

    provider.isValidPlate(plate, function (err, isValid) {
      expect(isValid, plate + ' should be valid').is.true;
      done();
    });
  });

  it('should call checkVehicleHistory for pl', function (done) {

    var plate = 'PWR 17WQ';
    var vin = 'ABC123456789DEF';
    var firstRegistrationDate = 'dd.mm.rrrr';

    provider.__set__({
      webProvider: {
        checkVehicleHistory: function (plate, vin, firstRegistrationDate, opts, callback) {

          expect(opts).to.have.ownProperty('resolver');
          expect(opts).to.have.ownProperty('example');
          expect(opts).to.have.ownProperty('form');
          expect(opts).to.have.ownProperty('parser');

          callback(null, {});
        }
      }
    });

    provider.checkVehicleHistory(plate, vin, firstRegistrationDate, options, function (err, report) {
      should.not.exist(err);
      should.exist(report);
      done();
    });
  });
});