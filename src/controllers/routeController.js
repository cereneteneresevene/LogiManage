const Route = require('../models/Route');
const openStreetMapService = require('../services/openStreetMapService');
const CustomError = require('../utils/customError');

exports.createRoute = async (req, res, next) => {
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(201).json({ message: 'Rota başarıyla oluşturuldu.', route });
  } catch (error) {
    next(error); 
  }
};

exports.getAllRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find().populate('assignedDriver');
    res.json(routes);
  } catch (error) {
    next(error);
  }
};

exports.getRoutesByDriver = async (req, res, next) => {
  try {
    const routes = await Route.find({ assignedDriver: req.user.id });
    res.json(routes);
  } catch (error) {
    next(error);
  }
};

exports.updateRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) throw new CustomError('Rota bulunamadı.', 404);

    if (req.user.role === 'driver' && route.assignedDriver.toString() !== req.user.id) {
      throw new CustomError('Bu rotayı güncelleme yetkiniz yok.', 403);
    }

    const updatedRoute = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Rota başarıyla güncellendi.', updatedRoute });
  } catch (error) {
    next(error);
  }
};

exports.deleteRoutes = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) throw new CustomError('Rota bulunamadı.', 404);

    await route.deleteOne();
    res.json({ message: 'Rota başarıyla silindi.' });
  } catch (error) {
    next(error);
  }
};

exports.getCoordinates = async (req, res, next) => {
  try {
    const { address } = req.query;
    const coordinates = await openStreetMapService.geocodeAddress(address);
    res.json(coordinates);
  } catch (error) {
    next(new CustomError('Adres için koordinat bulunamadı.', 500));
  }
};

exports.getAddress = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const address = await openStreetMapService.reverseGeocode(lat, lon);
    res.json(address);
  } catch (error) {
    next(new CustomError('Koordinatlar için adres bulunamadı.', 500));
  }
};

exports.planRoute = async (req, res, next) => {
  try {
    const { start, end } = req.body;
    const route = await openStreetMapService.getRoute(start, end);
    res.json(route);
  } catch (error) {
    next(new CustomError('Rota planlanamadı.', 500));
  }
};
