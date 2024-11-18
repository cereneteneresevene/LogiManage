const axios = require('axios');

// Coğrafi Kodlama (Adres -> Koordinatlar)
exports.geocodeAddress = async (address) => {
  try {
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
    return response.data[0];
  } catch (error) {
    console.error('Coğrafi kodlama hatası:', error.message);
    throw error;
  }
};

// Ters Coğrafi Kodlama (Koordinatlar -> Adres)
exports.reverseGeocode = async (lat, lon) => {
  try {
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
    return response.data;
  } catch (error) {
    console.error('Ters coğrafi kodlama hatası:', error.message);
    throw error;
  }
};

// OSRM ile Rota Planlama
exports.getRoute = async (start, end) => {
  try {
    const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}`, {
      params: {
        overview: 'full',
        steps: true
      }
    });
    return response.data.routes[0];
  } catch (error) {
    console.error('Rota planlama hatası:', error.message);
    throw error;
  }
};
