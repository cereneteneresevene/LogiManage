const User = require('../models/User');
const CustomError = require('../utils/customError');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(new CustomError('Kullanıcıları listeleme başarısız.', 500));
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new CustomError('Kullanıcı bulunamadı.', 404));
    }

    if (req.user.role === 'admin') {
      return res.json(user);
    }

    if (req.user.role === 'manager') {
      if (user.role === 'admin') {
        return next(new CustomError('Yöneticiler admin kullanıcılarını görüntüleyemez.', 403));
      }
      return res.json(user);
    }

    if (req.user.role === 'driver') {
      if (req.user.id !== req.params.id) {
        return next(new CustomError('Sürücüler yalnızca kendi bilgilerini görüntüleyebilir.', 403));
      }
      return res.json(user);
    }

    next(new CustomError('Bu işlem için yetkiniz yok.', 403));
  } catch (error) {
    next(new CustomError('Sunucu hatası.', 500));
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const requestingUser = req.user;
    const { id } = req.params;

    if (requestingUser.role === 'admin') {
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (!user) {
        return next(new CustomError('Kullanıcı bulunamadı.', 404));
      }
      return res.json(user);
    }

    if (requestingUser.role === 'manager') {
      const user = await User.findById(id);
      if (!user || user.role !== 'driver') {
        return next(new CustomError('Bu kullanıcı üzerinde işlem yapamazsınız.', 403));
      }
      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
      return res.json(updatedUser);
    }

    if (requestingUser.role === 'driver') {
      if (requestingUser.id !== id) {
        return next(new CustomError('Sadece kendi profilinizi güncelleyebilirsiniz.', 403));
      }
      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
      return res.json(updatedUser);
    }

    next(new CustomError('Bu işlemi yapmaya yetkiniz yok.', 403));
  } catch (error) {
    next(new CustomError('Sunucu hatası.', 500));
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const requestingUser = req.user;
    const { id } = req.params;

    if (requestingUser.role === 'admin') {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return next(new CustomError('Kullanıcı bulunamadı.', 404));
      }
      return res.json({ message: 'Kullanıcı silindi.' });
    }

    if (requestingUser.role === 'manager') {
      const user = await User.findById(id);
      if (!user || user.role !== 'driver') {
        return next(new CustomError('Bu kullanıcı üzerinde işlem yapamazsınız.', 403));
      }
      await User.findByIdAndDelete(id);
      return res.json({ message: 'Kullanıcı silindi.' });
    }

    next(new CustomError('Bu işlemi yapmaya yetkiniz yok.', 403));
  } catch (error) {
    next(new CustomError('Sunucu hatası.', 500));
  }
};