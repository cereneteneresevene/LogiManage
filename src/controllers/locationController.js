const Location = require('../models/Location');

exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Sadece şoförler konum güncelleyebilir.' });
    }

    let location = await Location.findOne({ driver: req.user.id });
    if (location) {
      location.latitude = latitude;
      location.longitude = longitude;
      location.updatedAt = Date.now();
    } else {
      location = new Location({
        driver: req.user.id,
        latitude,
        longitude,
      });
    }

    await location.save();
    res.json({ message: 'Konum başarıyla güncellendi.', location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllLocations = async (req, res) => {
    try {
      if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Bu işlemi yapmaya yetkiniz yok.' });
      }
  
      const locations = await Location.find().populate('driver', 'name'); 
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  