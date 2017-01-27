const provider = require('../../lib/provider/provider');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

describe('provider test', () => {

  it('should get Poland provider', done => {

    const plate = 'pwr 17wq';

    provider.selectProvider(plate, (err, dataProvider) => {
      expect(dataProvider).to.be.not.null;
      done();
    });
  });
});