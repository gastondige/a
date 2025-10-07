const { auth } = require('../middleware/auth');
const express = require('express');
const { body, validationResult } = require('express-validator');
const Contract = require('../models/Contract');

const router = express.Router();

// Generate unique contract ID
const generateContractId = () => {
  return 'VRTS-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Service pricing
const servicePrices = {
  catfish: 299,
  infidelity: 499,
  background: 199,
  fraud: 399,
  digital: 349,
  corporate: 799,
  other: 250
};

// Create new contract
router.post('/', auth, (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    serviceType,
    paymentMethod,
    targetInfo,
    clientName,
    clientEmail,
    anonymousService
  } = req.body;

  const contractData = {
    contractId: generateContractId(),
    userId: req.user.id,
    serviceType,
    paymentMethod,
    targetInfo,
    clientName,
    clientEmail,
    anonymousService: anonymousService || false,
    price: servicePrices[serviceType]
  };

  Contract.create(contractData, (err, result) => {
    if (err) {
      console.error('Contract creation error:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(201).json({
      message: 'Contract submitted successfully',
      contract: {
        id: result.insertId,
        contractId: contractData.contractId,
        serviceType: contractData.serviceType,
        price: contractData.price,
        status: 'pending',
        createdAt: new Date()
      }
    });
  });
});

// Get user's contracts
router.get('/my-contracts', auth, (req, res) => {
  Contract.findByUserId(req.user.id, (err, contracts) => {
    if (err) {
      console.error('Get contracts error:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(contracts);
  });
});

// Get specific contract
router.get('/:id', auth, (req, res) => {
  Contract.findById(req.params.id, (err, contract) => {
    if (err) {
      console.error('Get contract error:', err.message);
      return res.status(500).json({ message: 'Server error' });
    }

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user owns the contract
    if (contract.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(contract);
  });
});

module.exports = router;
