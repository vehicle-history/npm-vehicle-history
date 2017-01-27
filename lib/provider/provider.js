'use strict';

const async = require('async');
const logger = require('../logger/logger').logger;

const vehicleHistoryModel = require('vehicle-history-model');
const InvalidVehiclePlateError = vehicleHistoryModel.error.InvalidVehiclePlateError;

const plProvider = require('./plProvider');
const ukProvider = require('./ukProvider');

const selectProvider = function selectProvider(plate, cb) {
  async.parallel({
      pl: function (callback) {
        plProvider.isValidPlate(plate, (err, valid) => {
          if (valid) {
            return callback(null, plProvider);
          }

          return callback(err, null);
        });
      },
      uk: function (callback) {
        ukProvider.isValidPlate(plate, (err, valid) => {
          if (valid) {
            return callback(null, ukProvider);
          }

          return callback(err, null);
        });
      }
    },
    (err, results) => {

      if (!err) {
        for (const i in results) {
          if (results.hasOwnProperty(i)) {
            const provider = results[i];

            if (provider !== null) {
              return cb(null, provider);
            }
          }
        }
      }

      logger.info('Unable do select provider for plate "%s"', plate);
      return cb(new InvalidVehiclePlateError(`Invalid vehicle plate: ${plate}`));
    });
};

module.exports = {
  selectProvider: selectProvider
};
