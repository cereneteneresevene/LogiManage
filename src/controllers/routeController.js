const Route = require('../models/Route');
const openStreetMapService = require('../services/openStreetMapService');

exports.createRoute = async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(201).json({ message: 'Rota başarıyla oluşturuldu.', route });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate('assignedDriver');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoutesByDriver = async (req, res) => {
  try {
    const routes = await Route.find({ assignedDriver: req.user.id });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Rota bulunamadı.' });

    if (req.user.role === 'driver') {
      if (route.assignedDriver.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Bu rotayı güncelleme yetkiniz yok.' });
      }
    }

    const updatedRoute = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Rota başarıyla güncellendi.', updatedRoute });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRoutes = async(req,res) =>{
  try{
    const route = await Route.findById(req.params.id);
    if(!route) return res.status(404).json({message : 'Rota bulunamadı.'});

    await route.deleteOne();
    res.json({message: 'Rota başarıyla silindi.'});
  } catch(error){
    res.status(500).json({message: error.message});
  }
}

// Coğrafi Kodlama (Adres -> Koordinatlar)
exports.getCoordinates = async (req, res) => {
  try {
    const { address } = req.query;
    const coordinates = await openStreetMapService.geocodeAddress(address);
    res.json(coordinates);
  } catch (error) {
    res.status(500).json({ message: 'Adres için koordinat bulunamadı.' });
  }
};

// Ters Coğrafi Kodlama (Koordinatlar -> Adres)
exports.getAddress = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const address = await openStreetMapService.reverseGeocode(lat, lon);
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: 'Koordinatlar için adres bulunamadı.' });
  }
};

// Rota Planlama
exports.planRoute = async (req, res) => {
  try {
    const { start, end } = req.body; // start ve end: [enlem, boylam] formatında olmalı
    const route = await openStreetMapService.getRoute(start, end);
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Rota planlanamadı.' });
  }
};
