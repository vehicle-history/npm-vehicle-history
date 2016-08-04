'use strict';

var logger = require('./logger/logger').logger;
var vehicleHistoryModel = require('vehicle-history-model');
var responseBuilder = vehicleHistoryModel.builder.responseBuilder;

var isExampleBusPlate = function isExampleBusPlate(plate, options) {
  return options.get('providers.bus-pl.example.plate') === plate;
};

var getBusExampleReportV1 = function getBusExampleReportV1(options, callback) {
  var map = {
    'name.manufacturer': 'SOLARIS',
    'name.name': null,
    'name.model': 'URBINO 12',
    'variant.type': 'BUS',
    'variant.kind': 'CITY',
    'engine.cc': 2396,
    'engine.fuel': 'DIESEL',
    'production.year': 2008,
    'policy.status': 'UPTODATE',
    'registration.status': 'REGISTERED',
    'registration.firstDate': '2008-11-21T00:00:00.000Z',
    'inspection.status': 'UPTODATE',
    'mileage.value': 779951,
    'mileage.type': 'KM',
    'status.stolen': null,
    'plate.value': 'SBE12345',
    'plate.country': 'PL',
    'vin.value': 'SUU2411618BPN1684',
    'events': [
      {
        type: 'REGISTRATION',
        ownerType: null,
        location: null,
        note: null,
        createdAt: '2008-01-16T22:00:00.000Z',
        expireAt: null,
        description: 'First registration',
        firstOwner: null,
        mileage: null,
        abroadRegistration: false
      },
      {
        type: 'INSPECTION',
        ownerType: null,
        location: null,
        note: null,
        createdAt: '2016-03-11T22:00:00.000Z',
        expireAt: '2021-09-11T22:00:00.000Z',
        description: 'Inspection (11.03.2016)',
        firstOwner: null,
        mileage: {
          value: 779951,
          type: 'KM'
        },
        abroadRegistration: null
      }
    ]
  };

  responseBuilder.build(map, options, function (buildErr, report) {
    if (buildErr) {
      logger.error('unable to generate example report by responseBuilder: %s', buildErr);
      return callback(buildErr);
    }

    return callback(buildErr, report);
  });
};

module.exports = {
  getBusExampleReportV1: getBusExampleReportV1,
  isExampleBusPlate: isExampleBusPlate
};