const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static create(userData, callback) {
    const { name, email, password, ipAddress } = userData;

    bcrypt.hash(password, 12, (err, hashedPassword) => {
      if (err) return callback(err);

      const query = 'INSERT INTO users (name, email, password, ip_address) VALUES (?, ?, ?, ?)';
      db.query(query, [name, email, hashedPassword, ipAddress], (err, result) => {
        if (err) return callback(err);
        callback(null, {
          id: result.insertId,
          name,
          email,
          ipAddress
        });
      });
    });
  }

  static findByEmail(email, callback) {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  static findById(id, callback) {
    const query = 'SELECT id, name, email, role, ip_address as ipAddress, registration_date as registrationDate, last_login as lastLogin FROM users WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  static updateLoginTime(id, callback) {
    const query = 'UPDATE users SET last_login = NOW() WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  }

  static getAllUsers(callback) {
    const query = 'SELECT id, name, email, role, ip_address as ipAddress, registration_date as registrationDate, last_login as lastLogin FROM users ORDER BY registration_date DESC';
    db.query(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}

module.exports = User;
