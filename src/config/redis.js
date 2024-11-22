const Redis = require('ioredis-mock'); 

const redisClient = new Redis(); 

redisClient.on('connect', () => {
  console.log('Mock Redis bağlantısı başarıyla kuruldu.');
});

redisClient.on('error', (err) => {
  console.error('Mock Redis bağlantı hatası:', err);
});

module.exports = redisClient;
