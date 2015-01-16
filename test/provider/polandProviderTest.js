var provider = require('../../lib/provider/polandProvider');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('poland provider test', function () {

  it('should validate plate', function (done) {

    var plate = 'PWR 17WQ';
    var isValid = provider.isValidPlate(plate);
    expect(isValid, plate + ' should be valid').is.true;
    done();
  });
});