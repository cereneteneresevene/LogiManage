const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Hata: ${err.message}`);
  res.status(500).json({ message: 'Sunucu hatası oluştu.' });
};

module.exports = errorHandler;
