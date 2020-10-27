const winston = require('winston');

// set up logger
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple(),
  ),
});
// add logger to winston
winston.add(logger);

module.exports = winston;
