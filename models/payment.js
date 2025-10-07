const db = require('../config/database');

class Payment {
  static getTotalRevenue(callback) {
    const query = 'SELECT SUM(amount) as total FROM payments WHERE status = "completed"';
    db.query(query, (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]?.total || 0);
    });
  }
}

module.exports = Payment;
