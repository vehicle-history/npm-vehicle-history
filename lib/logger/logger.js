var winston = require('winston');
var Loggly = require('winston-loggly').Loggly;
var logLevel = process.env.LOG_LEVEL || 'info';

var logglyOptions = {
  level: logLevel,
  subdomain: "zenedith",
  inputToken: 'b24d575e-842b-4b4d-ac91-6c0a12b60476',
  tags: ["NodeJS"],
  json: true
};

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({ level: logLevel })
  ]
});

logger.add(Loggly, logglyOptions);

if (process.env.LOG_STREAM) {
  logger.add(winston.transports.File, {
      filename: process.env.LOG_STREAM,
      level: logLevel
    }
  );
}

module.exports.changeLogLevel = function (logLevel) {
  for (var i in logger.transports) {
    if (logger.transports.hasOwnProperty(i)) {
      var transport = logger.transports[i];
      transport.level = logLevel;
    }
  }
};

module.exports.logger = logger;