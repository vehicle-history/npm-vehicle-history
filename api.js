require('newrelic');
var myRestifyApi = require('my-restify-api');
var UnauthorizedError = myRestifyApi.error.UnauthorizedError;
var oauth = myRestifyApi.plugin.oauth;
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
  },
  InvalidVehiclePlate: {
    class: 'BadRequestError'
  }
};

var cacheHandler = function (req, res, next) {
  res.cache('public', {maxAge: 60});
  res.header('Vary', 'Accept-Language');
//    res.header('Last-Modified', new Date());
  return next();
};

var authHandler = function (req, res, next) {
  try {
    oauth(req)
      .scope('openid')
      .client('vehiclehistory')
      .user();
  }
  catch (e) {
    return next(new UnauthorizedError('Unauthorized error: ' + e.message));
  }

  return next();
};

var routes = {
  'get': [
    {
      options: {
        path: PATH, version: '1.0.0'
      },
      authMethod: authHandler,
      cache: cacheHandler,
      controllerMethod: vehicleHistoryController.checkVehicleHistoryV1
    }
  ]
};

myRestifyApi.runServer(routes, errorHandlers, options, function (err, port) {
  logger.debug('myRestifyApi running on port: %d', port);
});
