const db = require('../config/database');

class Contract {
  static create(contractData, callback) {
    const {
      contractId, userId, serviceType, paymentMethod,
      targetInfo, clientName, clientEmail, anonymousService, price
    } = contractData;

    const query = `
      INSERT INTO contracts
      (contract_id, user_id, service_type, payment_method, target_info, client_name, client_email, anonymous_service, price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
      contractId, userId, serviceType, paymentMethod,
      targetInfo, clientName, clientEmail, anonymousService, price
    ], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  }

  static findByUserId(userId, callback) {
    const query = `
      SELECT c.*, u.name as user_name, u.email as user_email
      FROM contracts c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `;
    db.query(query, [userId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }

  static findById(id, callback) {
    const query = 'SELECT * FROM contracts WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  static updateStatus(id, status, adminNotes, callback) {
    const query = 'UPDATE contracts SET status = ?, admin_notes = ? WHERE id = ?';
    db.query(query, [status, adminNotes, id], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  }

  static findAll(status, callback) {
    let query = `
      SELECT c.*, u.name as user_name, u.email as user_email, u.ip_address
      FROM contracts c
      LEFT JOIN users u ON c.user_id = u.id
    `;

    const params = [];
    if (status) {
      query += ' WHERE c.status = ?';
      params.push(status);
    }

    query += ' ORDER BY c.created_at DESC';

    db.query(query, params, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
}

module.exports = Contract;
