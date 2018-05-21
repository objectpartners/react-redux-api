var winston = require('winston');
var path = require('path');

var properties = require('./properties');

var name = require(path.join(__dirname, '../package.json')).name;

module.exports = winston.createLogger({
  level: properties.logLevel,
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
