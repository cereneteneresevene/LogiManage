const Vehicle = require('../models/Vehicle');
const User = require('../models/User'); // Aracın kime ait olduğunu kontrol etmek için

// Araç oluşturma - Sadece Admin ve Manager
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tüm araçları listeleme - Sadece Admin ve Manager
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir aracı görüntüleme - Driver yalnızca kendi aracını görebilir
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Araç bulunamadı.' });

    // Eğer kullanıcı Driver ise, sadece kendine atanmış aracı görüntüleyebilir
    if (req.user.role === 'driver') {
      const user = await User.findById(req.user.id);
      if (!user || user.assignedVehicleId.toString() !== vehicle._id.toString()) {
        return res.status(403).json({ message: 'Bu araca erişim yetkiniz yok.' });
      }
    }

    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Araç güncelleme - Sadece Admin ve Manager
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: 'Araç bulunamadı.' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Araç silme - Sadece Admin ve Manager
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Araç bulunamadı.' });
    res.json({ message: 'Araç başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
