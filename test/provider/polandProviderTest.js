var provider = require('../../lib/provider/polandProvider');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('poland provider test', function () {

  it('should validate plates', function (done) {

    var plates = {
      'pwr 17wq': true,
      'pwr-17wq': true,
      'pwr17wq': true,
      'PWR 17WQ': true,
      'PWR-17WQ': true,
      'PWR17WQ': true,
      'ABC 123Z': true,
      'A0 ABCD': true,
      'A0 ABCDE': true,
      'A0 AB0DE': true,
      'PWQ GO01': true,
      'pw 17wq': false,
      'PW 17WQ': false,
      'PW 17WQ': false
    };

    for (var plate in plates) {
      if (plates.hasOwnProperty(plate)) {
        var expected = plates[plate];

        var response = provider.isValidPlate(plate);
        expect(response, plate + ' should be ' + expected).to.be[expected];
      }
    }

    done();

  });
});