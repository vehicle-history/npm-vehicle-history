var polandProvider = require('./polandProvider');

var providers = [
  polandProvider
];

module.exports.selectProvider = function (plate) {
  for (var i in providers) {
    if (providers.hasOwnProperty(i)) {
      var provider = providers[i];

      if (provider.isValidPlate(plate)) {
        return provider;
      }
    }
  }

  throw Error('Unable to select provider for plate: ' + plate);
};
