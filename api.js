require('newrelic');
var myRestifyApi = require('my-restify-api');
var vehicleHistoryController = require('./lib/controller/vehicleHistory');
var logger = require('./lib/logger/logger').logger;

var PATH = '/api/vehicle-history';

var options = {
  appName: 'API',
  swagger: {
    enabled: true,
    apiDocsDir: __dirname + '/public/'
  }
};

var errorHandlers = {
  VehicleNotFound: {
    class: 'NotFoundError'
  },
  ServiceUnavailable: {
    class: 'ServiceUnavailableError'
  }
};

var routes = {
  'get': [
    {
      options: {
        path: PATH, version: '1.0.0'
      },
      controllerMethod: vehicleHistoryController.checkVehicleHistoryV1
    }
  ]
};

myRestifyApi.runServer(routes, errorHandlers, options, function (err, port) {
  logger.debug('myRestifyApi running on port: %d', port);
});
