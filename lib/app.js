var fs = require('fs');
var myRestifyApi = require('my-restify-api');
var UnauthorizedError = myRestifyApi.error.UnauthorizedError;
var oauth = myRestifyApi.plugin.oauth;
var vehicleHistoryV1Controller = require('./controller/vehicleHistoryV1');
var logger = require('./logger/logger').logger;

var startServer = function startServer(callback) {
  fs.readFile('config/public.key', function (err, data) {
    if (err) {
      logger.debug('config/public.key read error: ', err);
      throw err;
    }

    var options = {
      appName: 'API',
      swagger: {
        enabled: true,
        apiDocsDir: __dirname + '/../public/'
      },
      authorization: {
        authHeaderPrefix: 'x-auth-',
        key: data,
        noVerify: false
      },
      bodyParser: {
        enabled: true,
        options: {
          maxBodySize: 1e6,
          mapParams: true,
          overrideParams: false
        }
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

    var publicCacheHandler = function publicCacheHandler(req, res, next) {
      res.cache('public', {maxAge: 600});
      res.header('Vary', 'Accept-Language, Accept-Encoding, Accept, Content-Type');
      //res.charSet('utf-8');
      return next();
    };

    var noCacheHandler = function noCacheHandler(req, res, next) {
      res.cache('private');
      //res.charSet('utf-8');
      return next();
    };

    var noPreconditionHandler = function noPreconditionHandler(req, res, next) {
      return next();
    };

    var getHistoryAuthHandler = function getHistoryAuthHandler(req, res, next) {
      //return oauth(req, next)
      //  .scope('openid')
      //  .client('vehiclehistory')
      //  .
      next();
    };

    var routes = {
      get: [],
      post: [],
      put: [],
      del: []
    };

    routes.get.push({
      options: {
        path: '/api/vehicle-history', version: '1.0.0'
      },
      authMethod: getHistoryAuthHandler,
      cache: publicCacheHandler,
      precondition: noPreconditionHandler,
      controllerMethod: vehicleHistoryV1Controller.checkVehicleHistoryV1
    });

    routes.get.push({
      options: {
        path: '/api/vehicle-reports', version: '1.0.0'
      },
      authMethod: getHistoryAuthHandler,
      cache: publicCacheHandler,
      precondition: noPreconditionHandler,
      controllerMethod: vehicleHistoryV1Controller.getVehicleReportsV1
    });

    routes.get.push({
      options: {
        path: '/api/bus-reports/:plate', version: '1.0.0'
      },
      authMethod: getHistoryAuthHandler,
      cache: publicCacheHandler,
      precondition: noPreconditionHandler,
      controllerMethod: vehicleHistoryV1Controller.getBusReportV1
    });

    var server = myRestifyApi.createServer(routes, errorHandlers, options);

    server.opts(/.*/, function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', req.header('Access-Control-Request-Method'));
      res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
      res.send(200);
      return next();
    });

    myRestifyApi.runServer(server, options, function (err, port) {
      logger.debug('myRestifyApi running on port: %d', port);
      return callback(err, port);
    });

  });
};

module.exports = {
  startServer: startServer
};