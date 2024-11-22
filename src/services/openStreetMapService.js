const axios = require('axios');
const redisClient = require('../config/redis'); 

exports.geocodeAddress = async (address) => {
  const cacheKey = `geocode:${address}`;
  
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache'den alındı: ${cacheKey}`);
      return JSON.parse(cachedData);
    }

    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1,
        limit: 1
      },
      headers: {
        'User-Agent': 'cerentanriseven/1.0 (ceren.tnrsvn@gmail.com)' 
      }
    });

    const data = response.data[0];

    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 3600 }); 
    return data;

  } catch (error) {
    console.error('Coğrafi kodlama hatası:', error.message);
    throw error;
  }
};

exports.reverseGeocode = async (lat, lon) => {
  const cacheKey = `reverseGeocode:${lat},${lon}`;
  
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache'den alındı: ${cacheKey}`);
      return JSON.parse(cachedData);
    }

    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'json',
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'cerentanriseven/1.0 (ceren.tnrsvn@gmail.com)' 
      }
    });

    const data = response.data;

    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 3600 }); 
    return data;

  } catch (error) {
    console.error('Ters coğrafi kodlama hatası:', error.message);
    throw error;
  }
};

exports.getRoute = async (start, end) => {
  const cacheKey = `route:${start.join(',')}:${end.join(',')}`;
  
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache'den alındı: ${cacheKey}`);
      return JSON.parse(cachedData);
    }

    const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}`, {
      params: {
        overview: 'full',
        steps: true
      }
    });

    const data = response.data.routes[0];

    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 3600 }); 
    return data;

  } catch (error) {
    console.error('Rota planlama hatası:', error.message);
    throw error;
  }
};
