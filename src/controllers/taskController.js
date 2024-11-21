const Task = require('../models/Task');
const CustomError = require('../utils/customError');

exports.createTask = async (req, res, next) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json({ message: 'Görev başarıyla oluşturuldu.', task });
  } catch (error) {
    next(new CustomError('Görev oluşturulurken bir hata oluştu.', 500));
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().populate('driver').populate('vehicle');
    res.json(tasks);
  } catch (error) {
    next(new CustomError('Görevler alınırken bir hata oluştu.', 500));
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return next(new CustomError('Görev bulunamadı.', 404));
    }
    res.json(task);
  } catch (error) {
    next(new CustomError('Görev güncellenirken bir hata oluştu.', 500));
  }
};

exports.getTasksByDriver = async (req, res, next) => {
  try {
    const tasks = await Task.find({ driver: req.user.id }).populate('vehicle');
    res.json(tasks);
  } catch (error) {
    next(new CustomError('Sürücüye ait görevler alınırken bir hata oluştu.', 500));
  }
};
