const Route = require('../models/Route');

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
