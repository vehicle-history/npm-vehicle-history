var async = require('async');
var logger = require('../logger/logger').logger;

var plProvider = require('./plProvider');
var ukProvider = require('./ukProvider');


module.exports.selectProvider = function (plate, cb) {
  async.parallel({
      pl: function (callback) {
        plProvider.isValidPlate(plate, function (err, valid) {
          if (valid) {
            return callback(null, plProvider);
          }

          return callback(err, null);
        });
      },
      uk: function (callback) {
        ukProvider.isValidPlate(plate, function (err, valid) {
          if (valid) {
            return callback(null, ukProvider);
          }

          return callback(err, null);
        });
      }
    },
    function (err, results) {

      if (!err) {
        for (var i in results) {
          if (results.hasOwnProperty(i)) {
            var provider = results[i];

            if (provider !== null) {
              return cb(null, provider);
            }
          }
        }
      }

      logger.info('Unable do select provider for plate %s". %s', plate, err);
      return cb(new Error('Unable to select provider for plate: "%s"', plate));
    });
};
