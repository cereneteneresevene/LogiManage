const User = require('../models/User');

// Tüm kullanıcıları listeleme
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcıları listeleme başarısız.' });
  }
};

// Belirli bir kullanıcıyı görüntüleme
exports.getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      }
  
      // Admin tüm kullanıcılara erişebilir
      if (req.user.role === 'admin') {
        return res.json(user);
      }
  
      // Manager yalnızca admin dışındaki kullanıcılara erişebilir
      if (req.user.role === 'manager') {
        if (user.role === 'admin') {
          return res.status(403).json({ message: 'Yöneticiler admin kullanıcılarını görüntüleyemez.' });
        }
        return res.json(user);
      }
  
      // Driver yalnızca kendisini görüntüleyebilir
      if (req.user.role === 'driver') {
        if (req.user.id !== req.params.id) {
          return res.status(403).json({ message: 'Sürücüler yalnızca kendi bilgilerini görüntüleyebilir.' });
        }
        return res.json(user);
      }
  
      res.status(403).json({ message: 'Bu işlem için yetkiniz yok.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Kullanıcı güncelleme
exports.updateUser = async (req, res) => {
    try {
      const requestingUser = req.user;
      const { id } = req.params;
  
      // Admin tüm kullanıcıları güncelleyebilir
      if (requestingUser.role === 'admin') {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
          return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
        return res.json(user);
      }
  
      // Manager, yalnızca Driver kullanıcılarını güncelleyebilir
      if (requestingUser.role === 'manager') {
        const user = await User.findById(id);
        if (!user || user.role !== 'driver') {
          return res.status(403).json({ message: 'Bu kullanıcı üzerinde işlem yapamazsınız.' });
        }
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        return res.json(updatedUser);
      }
  
      // Driver yalnızca kendi profilini güncelleyebilir
      if (requestingUser.role === 'driver') {
        if (requestingUser.id !== id) {
          return res.status(403).json({ message: 'Sadece kendi profilinizi güncelleyebilirsiniz.' });
        }
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        return res.json(updatedUser);
      }
  
      res.status(403).json({ message: 'Bu işlemi yapmaya yetkiniz yok.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// Kullanıcı silme
exports.deleteUser = async (req, res) => {
    try {
      const requestingUser = req.user;
      const { id } = req.params;
  
      // Admin tüm kullanıcıları silebilir
      if (requestingUser.role === 'admin') {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
          return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
        return res.json({ message: 'Kullanıcı silindi.' });
      }
  
      // Manager yalnızca Driver kullanıcılarını silebilir
      if (requestingUser.role === 'manager') {
        const user = await User.findById(id);
        if (!user || user.role !== 'driver') {
          return res.status(403).json({ message: 'Bu kullanıcı üzerinde işlem yapamazsınız.' });
        }
        await User.findByIdAndDelete(id);
        return res.json({ message: 'Kullanıcı silindi.' });
      }
  
      res.status(403).json({ message: 'Bu işlemi yapmaya yetkiniz yok.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
