const jwt = require('jsonwebtoken');
const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (user.role != 1) return res.status(400).json({ msg: 'not admin' });
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = admin;
