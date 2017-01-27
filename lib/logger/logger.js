'use strict';

const logger = require('winston');
const config = require('config');
const logLevel = process.env.LOG_LEVEL || 'info';

if (config.loggly && !logger.transports.Loggly) {
  const Loggly = require('winston-loggly').Loggly;

  logger.clear();
  logger.add(Loggly, config.loggly);
}

logger.level = logLevel;

if (process.env.LOG_STREAM) {
  logger.add(logger.transports.File, {
      filename: process.env.LOG_STREAM,
      level: logLevel
    }
  );
}

module.exports.changeLogLevel = (level) => {
  logger.level = level;
};

logger.args = function args(msg, params) {
  const argsObj = {};
  const argList = /\(([^)]*)/.exec(params.callee)[1].split(',');
  for (const i in argList) {
    if (typeof params[i] === 'function') {
      argsObj[argList[i]] = 'function';
    }
    else {
      argsObj[argList[i]] = params[i];
    }
  }

  logger.info(msg, argsObj);
};


module.exports.logger = logger;