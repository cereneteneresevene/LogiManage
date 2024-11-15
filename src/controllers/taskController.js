const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ message: 'Görev başarıyla oluşturuldu.', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('driver').populate('vehicle');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Görev bulunamadı.' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasksByDriver = async (req, res) => {
  try {
    const tasks = await Task.find({ driver: req.user.id }).populate('vehicle');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
