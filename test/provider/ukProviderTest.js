var provider = require('../../lib/provider/ukProvider');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('uk provider test', function () {

  it('should validate plate for uk', function (done) {

    var plate = 'A123 STE';
    var isValid = provider.isValidPlate(plate, function (err, isValid) {
      expect(isValid, plate + ' should be valid').is.true;
      done();
    });
  });
});