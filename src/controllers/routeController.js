const Route = require('../models/Route');

// Rota oluşturma
exports.createRoute = async (req, res) => {
  const { startPoint, endPoint } = req.body;
  try {
    const route = new Route({ startPoint, endPoint });
    await route.save();
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ message: 'Rota oluşturulamadı.' });
  }
};

// Tüm rotaları görüntüleme
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Rotalar alınamadı.' });
  }
};

// Belirli rotayı görüntüleme
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Rota bulunamadı.' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Rota alınamadı.' });
  }
};
