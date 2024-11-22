const Route = require('../models/Route');
const openStreetMapService = require('../services/openStreetMapService');
const CustomError = require('../utils/customError');
const redisClient = require('../config/redis'); 

exports.createRoute = async (req, res, next) => {
  try {
    const route = new Route(req.body);
    await route.save();

    await redisClient.del('allRoutes');

    res.status(201).json({ message: 'Rota başarıyla oluşturuldu.', route });
  } catch (error) {
    next(error); 
  }
};

exports.getAllRoutes = async (req, res, next) => {
  try {
    const cachedRoutes = await redisClient.get('allRoutes');
    if (cachedRoutes) {
      console.log('Cache\'den alındı: Tüm rotalar');
      return res.json(JSON.parse(cachedRoutes));
    }

    const routes = await Route.find().populate('assignedDriver');
    await redisClient.set('allRoutes', JSON.stringify(routes), { EX: 3600 }); 
    res.json(routes);
  } catch (error) {
    next(error);
  }
};

exports.getRoutesByDriver = async (req, res, next) => {
  try {
    const cacheKey = `routesByDriver:${req.user.id}`;
    
    const cachedRoutes = await redisClient.get(cacheKey);
    if (cachedRoutes) {
      console.log(`Cache'den alındı: ${cacheKey}`);
      return res.json(JSON.parse(cachedRoutes));
    }

    const routes = await Route.find({ assignedDriver: req.user.id });
    await redisClient.set(cacheKey, JSON.stringify(routes), { EX: 3600 }); 
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

    await redisClient.del('allRoutes');
    await redisClient.del(`routesByDriver:${req.user.id}`);

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

    await redisClient.del('allRoutes');
    await redisClient.del(`routesByDriver:${route.assignedDriver}`);

    res.json({ message: 'Rota başarıyla silindi.' });
  } catch (error) {
    next(error);
  }
};

exports.getCoordinates = async (req, res, next) => {
  try {
    const { address } = req.query;
    const cacheKey = `geocode:${address}`;

    const cachedCoordinates = await redisClient.get(cacheKey);
    if (cachedCoordinates) {
      console.log(`Cache'den alındı: ${cacheKey}`);
      return res.json(JSON.parse(cachedCoordinates));
    }

    const coordinates = await openStreetMapService.geocodeAddress(address);
    await redisClient.set(cacheKey, JSON.stringify(coordinates), { EX: 3600 }); 
    res.json(coordinates);
  } catch (error) {
    next(new CustomError('Adres için koordinat bulunamadı.', 500));
  }
};

exports.getAddress = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const cacheKey = `reverseGeocode:${lat},${lon}`;

    const cachedAddress = await redisClient.get(cacheKey);
    if (cachedAddress) {
      console.log(`Cache'den alındı: ${cacheKey}`);
      return res.json(JSON.parse(cachedAddress));
    }

    const address = await openStreetMapService.reverseGeocode(lat, lon);
    await redisClient.set(cacheKey, JSON.stringify(address), { EX: 3600 });
  } catch (error) {
    next(new CustomError('Koordinatlar için adres bulunamadı.', 500));
  }
};

exports.planRoute = async (req, res, next) => {
  try {
    const { start, end } = req.body;
    const cacheKey = `routePlan:${start.join(',')}:${end.join(',')}`;

    const cachedRoute = await redisClient.get(cacheKey);
    if (cachedRoute) {
      console.log(`Cache'den alındı: ${cacheKey}`);
      return res.json(JSON.parse(cachedRoute));
    }

    const route = await openStreetMapService.getRoute(start, end);
    await redisClient.set(cacheKey, JSON.stringify(route), { EX: 3600 }); 
    res.json(route);
  } catch (error) {
    next(new CustomError('Rota planlanamadı.', 500));
  }
};
