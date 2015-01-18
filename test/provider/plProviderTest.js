var provider = require('../../lib/provider/plProvider');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('poland provider test', function () {

  it('should validate plate for pl', function (done) {

    var plate = 'PWR 17WQ';
    provider.isValidPlate(plate, function (err, isValid) {
      expect(isValid, plate + ' should be valid').is.true;
      done();
    });

  });
});