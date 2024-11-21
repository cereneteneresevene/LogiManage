const Location = require('../models/Location');
const CustomError = require('../utils/customError');

exports.updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    if (req.user.role !== 'driver') {
      throw new CustomError('Sadece şoförler konum güncelleyebilir.', 403); 
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
    next(error); 
  }
};

exports.getAllLocations = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      throw new CustomError('Bu işlemi yapmaya yetkiniz yok.', 403); 
    }

    const locations = await Location.find().populate('driver', 'name'); 
    res.json(locations);
  } catch (error) {
    next(error); 
  }
};
