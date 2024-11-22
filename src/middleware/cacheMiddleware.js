const redisClient = require('../config/redis');

const cacheMiddleware = async (req, res, next) => {
  const cacheKey = req.originalUrl; 
  try {
    const cachedData = await redisClient.get(cacheKey); 
    if (cachedData) {
      console.log('Mock Cache’den veri alınıyor...');
      return res.json(JSON.parse(cachedData)); 
    }
    next();
  } catch (error) {
    console.error('Cache middleware hatası:', error);
    next(); 
  }
};

module.exports = cacheMiddleware;
