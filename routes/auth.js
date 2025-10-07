const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// Get IP Address
const getClientIP = (req) => {
  return req.ip ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

// Register User
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  // Check if user exists
  User.findByEmail(email, (err, existingUser) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const userData = {
      name,
      email,
      password,
      ipAddress: getClientIP(req)
    };

    User.create(userData, (err, result) => {
      if (err) {
        console.error('Create user error:', err);
        return res.status(500).json({ message: 'Server error during registration' });
      }

      const token = generateToken(result.id);

      res.status(201).json({
        token,
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
          role: 'user'
        }
      });
    });
  });
});

// Login User
router.post('/login', [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  User.findByEmail(email, (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Password compare error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Update last login
      User.updateLoginTime(user.id, (err) => {
        if (err) console.error('Update login time error:', err);

        const token = generateToken(user.id);

        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      });
    });
  });
});

// Get Current User
router.get('/me', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

    User.findById(decoded.id, (err, user) => {
      if (err) {
        console.error('Get user error:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      res.json(user);
    });
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});

module.exports = router;
