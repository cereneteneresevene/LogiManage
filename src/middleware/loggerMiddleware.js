const logger = require('../utils/logger');

const apiLogger = (req, res, next) => {
  const { method, url, headers, body } = req;
  logger.info(`API Request - Method: ${method}, URL: ${url}, Body: ${JSON.stringify(body)}`);
  next();
};

module.exports = apiLogger;
