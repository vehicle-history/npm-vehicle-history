var winston = require('winston');
var logLevel = process.env.LOG_LEVEL || 'info';

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({ level: logLevel })
  ]
});

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