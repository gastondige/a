const express = require('express');
const Contract = require('../models/Contract');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all contracts for admin
router.get('/contracts', adminAuth, (req, res) => {
  const { status } = req.query;

  Contract.findAll(status, (err, contracts) => {
    if (err) {
      console.error('Admin contracts error:', err.message);
      return res.status(500).send('Server error');
    }

    res.json({
      contracts,
      total: contracts.length,
      currentPage: 1
    });
  });
});

// Update contract status
router.put('/contracts/:id', adminAuth, (req, res) => {
  const { status, adminNotes } = req.body;

  Contract.updateStatus(req.params.id, status, adminNotes, (err, result) => {
    if (err) {
      console.error('Update contract error:', err.message);
      return res.status(500).send('Server error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.json({ message: 'Contract updated successfully' });
  });
});

// Get all users
router.get('/users', adminAuth, (req, res) => {
  User.getAllUsers((err, users) => {
    if (err) {
      console.error('Admin users error:', err.message);
      return res.status(500).send('Server error');
    }
    res.json({
      users,
      total: users.length
    });
  });
});

// Revenue analytics
router.get('/revenue', adminAuth, (req, res) => {
  Payment.getTotalRevenue((err, totalRevenue) => {
    if (err) {
      console.error('Revenue error:', err.message);
      return res.status(500).send('Server error');
    }

    // Get contracts for additional analytics
    Contract.findAll(null, (err, contracts) => {
      if (err) {
        console.error('Revenue contracts error:', err.message);
        return res.status(500).send('Server error');
      }

      const revenueByService = {};
      contracts.forEach(contract => {
        if (contract.payment_status === 'paid') {
          revenueByService[contract.service_type] = (revenueByService[contract.service_type] || 0) + contract.amount_paid;
        }
      });

      const contractsByStatus = {};
      contracts.forEach(contract => {
        contractsByStatus[contract.status] = (contractsByStatus[contract.status] || 0) + 1;
      });

      res.json({
        totalRevenue,
        revenueByService: Object.entries(revenueByService).map(([service, total]) => ({
          _id: service,
          total,
          count: contracts.filter(c => c.service_type === service && c.payment_status === 'paid').length
        })),
        contractsByStatus: Object.entries(contractsByStatus).map(([status, count]) => ({
          _id: status,
          count
        }))
      });
    });
  });
});

// Dashboard statistics
router.get('/dashboard', adminAuth, (req, res) => {
  User.getAllUsers((err, users) => {
    if (err) {
      console.error('Dashboard users error:', err.message);
      return res.status(500).send('Server error');
    }

    Contract.findAll(null, (err, contracts) => {
      if (err) {
        console.error('Dashboard contracts error:', err.message);
        return res.status(500).send('Server error');
      }

      const stats = {
        totalUsers: users.length,
        totalContracts: contracts.length,
        pendingContracts: contracts.filter(c => c.status === 'pending').length,
        completedContracts: contracts.filter(c => c.status === 'completed').length,
        totalRevenue: contracts.reduce((sum, c) => sum + (c.amount_paid || 0), 0)
      };

      const recentContracts = contracts
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      const recentUsers = users
        .sort((a, b) => new Date(b.registration_date) - new Date(a.registration_date))
        .slice(0, 5);

      res.json({
        stats,
        recentContracts,
        recentUsers
      });
    });
  });
});

module.exports = router;
