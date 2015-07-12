require('newrelic');
var fs = require('fs');
var myRestifyApi = require('my-restify-api');
var UnauthorizedError = myRestifyApi.error.UnauthorizedError;
var oauth = myRestifyApi.plugin.oauth;
var vehicleHistoryController = require('./lib/controller/vehicleHistory');
var logger = require('./lib/logger/logger').logger;

var PATH = '/api/vehicle-history';

fs.readFile('config/public.key', function (err, data) {
  if (err) {
    logger.debug('config/public.key read error: ', err);
    throw err;
  }

  var options = {
    appName: 'API',
    swagger: {
      enabled: true,
      apiDocsDir: __dirname + '/public/'
    },
    authorization: {
      authHeaderPrefix: 'x-auth-',
      key: data,
      noVerify: false
    },
    acceptable: [
      'application/vnd.vehicle-history.v1+json',
      'application/vnd.vehicle-history.v1+xml'
    ]
  };

  var errorHandlers = {
    VehicleNotFound: {
      className: 'NotFoundError'
    },
    ServiceUnavailable: {
      className: 'ServiceUnavailableError'
    },
    InvalidVehiclePlate: {
      className: 'BadRequestError'
    }
  };

  var cacheHandler = function (req, res, next) {
    res.cache('public', {maxAge: 600});
    res.header('Vary', 'Accept-Language, Accept-Encoding, Accept, Content-Type');
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

  var server = myRestifyApi.createServer(routes, errorHandlers, options);

  myRestifyApi.runServer(server, options, function (err, port) {
    logger.debug('myRestifyApi running on port: %d', port);
  });

});