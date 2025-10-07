const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    User.findById(decoded.id, (err, user) => {
      if (err) {
        console.error('Auth error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }

      req.user = user;
      next();
    });
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    next();
  });
};

module.exports = { auth, adminAuth };
