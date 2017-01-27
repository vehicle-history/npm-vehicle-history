'use strict';

const fs = require('fs');
const myRestifyApi = require('my-restify-api');
const oauth = myRestifyApi.plugin.oauth;
const vehicleHistoryV1Controller = require('./controller/vehicleHistoryV1');
const logger = require('./logger/logger').logger;

const startServer = function startServer(callback) {
  fs.readFile('config/public.key', (err, data) => {
    if (err) {
      logger.debug('config/public.key read error: ', err);
      throw err;
    }

    const options = {
      appName: 'API',
      swagger: {
        enabled: true,
        apiDocsDir: `${__dirname}/../public/`
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

    const errorHandlers = {
      VehicleNotFound: {
        className: 'NotFoundError'
      },
      ServiceUnavailable: {
        className: 'ServiceUnavailableError'
      },
      InvalidVehiclePlate: {
        className: 'BadRequestError'
      },
      '': {
        className: 'ServiceUnavailableError'
      }
    };

    const publicCacheHandler = function publicCacheHandler(req, res, next) {
      res.cache('public', {maxAge: 600});
      res.header('Vary', 'Accept-Language, Accept-Encoding, Accept, Content-Type');
      //res.charSet('utf-8');
      return next();
    };

    const noPreconditionHandler = function noPreconditionHandler(req, res, next) {
      return next();
    };

    const getHistoryDeprecatedAuthHandler = function getHistoryDeprecatedAuthHandler(req, res, next) {
      return oauth(req, next)
        .scope('openid')
        .client('vehiclehistory')
        .next();
    };

    const getHistoryAuthHandler = function getHistoryAuthHandler(req, res, next) {
      return oauth(req, next)
        .scope('vehicle:report:get')
        .user()
        .next();
    };
    const getBusAuthHandler = function getBusAuthHandler(req, res, next) {
      return oauth(req, next)
        .scope('bus:report:get')
        .user()
        .next();
    };

    const routes = {
      get: [],
      post: [],
      put: [],
      del: []
    };

    routes.get.push({
      options: {
        path: '/api/vehicle-history', version: '1.0.0'
      },
      authMethod: getHistoryDeprecatedAuthHandler,
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
      authMethod: getBusAuthHandler,
      cache: publicCacheHandler,
      precondition: noPreconditionHandler,
      controllerMethod: vehicleHistoryV1Controller.getBusReportV1
    });

    const server = myRestifyApi.createServer(routes, errorHandlers, options);

    server.opts(/.*/, (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', req.header('Access-Control-Request-Method'));
      res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
      res.send(200);
      return next();
    });

    myRestifyApi.runServer(server, options, (serverErr, port) => {
      logger.debug('myRestifyApi running on port: %d', port);
      return callback(serverErr, port);
    });

  });
};

module.exports = {
  startServer: startServer
};