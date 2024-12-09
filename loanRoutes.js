//loanRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createLoan, 
  getAllLoans, 
  getLoanDetails, 
  updateLoanStatus 
} = require('../controllers/loanController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Create a new loan
router.post('/', protect, createLoan);

// Get all loans (admin only)
router.get('/', protect, adminOnly, getAllLoans);

// Get loan details
router.get('/:loanId', protect, getLoanDetails);

// Update loan status (admin only)
router.patch('/:loanId/status', protect, adminOnly, updateLoanStatus);

module.exports = router;