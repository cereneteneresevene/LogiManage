const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Sunucuda bir hata oluştu.';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Geçersiz ID formatı: ${err.value}`;
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Geçersiz JSON formatı.';
  }

  if (err.name === 'AuthenticationError') {
    statusCode = 401;
    message = 'Kimlik doğrulama başarısız.';
  }

  if (err.name === 'AuthorizationError') {
    statusCode = 403;
    message = 'Bu işlem için yetkiniz yok.';
  }

  logger.error(`Hata: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    code: statusCode,
    type: err.name || 'Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
