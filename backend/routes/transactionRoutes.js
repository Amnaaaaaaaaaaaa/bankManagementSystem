const express = require('express');
const router = express.Router();
const { 
  createTransaction, 
  getLoanTransactions 
} = require('../controllers/transactionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Record a transaction (admin only)
router.post('/', protect, adminOnly, createTransaction);

// Get transactions for a specific loan
router.get('/loan/:loanId', protect, getLoanTransactions);

module.exports = router;