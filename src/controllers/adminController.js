const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcıları getirirken bir hata oluştu.' });
  }
};
