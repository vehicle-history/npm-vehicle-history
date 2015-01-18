var provider = require('../../lib/provider/provider');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('provider test', function () {

  it('should get Poland provider', function (done) {

    var plate = 'pwr 17wq';

    provider.selectProvider(plate, function (err, dataProvider) {
      expect(dataProvider).to.be.not.null;
      done();
    });
  });
});