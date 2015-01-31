var myRestifyApi = require('my-restify-api');
var api = require('./lib/controllers/api');
var logger = require('./lib/logger/logger').logger;

var PATH = '/api/vehicle-history';

var options = {
  appName: 'API',
  swagger: {
    enabled: true,
    apiDocsDir: __dirname + '/public/'
  }
};

var routes = {
  'get': [
    {
      options: {
        path: PATH, version: '1.0.0'
      },
      controllerMethod: api.checkVehicleHistoryV1
    }
  ]
};

myRestifyApi.runServer(routes, options, function (err, port) {
  logger.debug('myRestifyApi running on port: %d', port);
});
