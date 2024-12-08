//transactionController.js
const Loan = require('../models/loanModel');
const Transaction = require('../models/transactionModel');
const asyncHandler = require('express-async-handler');

// @desc    Record a transaction (payment or disbursement)
// @route   POST /api/transactions
// @access  Admin
exports.createTransaction = asyncHandler(async (req, res) => {
  const { loanId, amount, type, description } = req.body;

  // Find the loan
  const loan = await Loan.findById(loanId);
  if (!loan) {
    return res.status(404).json({ 
      success: false, 
      message: 'Loan not found' 
    });
  }

  // Validate transaction based on type
  if (type === 'PAYMENT') {
    if (amount > loan.remainingBalance) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount exceeds remaining balance'
      });
    }
  } else if (type === 'DISBURSEMENT') {
    if (loan.status !== 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'Loan must be approved before disbursement'
      });
    }
  }

  // Create transaction
  const transaction = new Transaction({
    loanId,
    amount,
    type,
    description,
    status: 'COMPLETED'
  });

  await transaction.save();

  // Update loan based on transaction type
  if (type === 'PAYMENT') {
    await loan.updateTotalAmountPaid(amount);
  } else if (type === 'DISBURSEMENT') {
    loan.status = 'ACTIVE';
    await loan.save();
  }

  res.status(201).json({
    success: true,
    message: 'Transaction recorded successfully',
    transaction
  });
});

// @desc    Get transactions for a specific loan
// @route   GET /api/loans/:loanId/transactions
// @access  Admin/User
exports.getLoanTransactions = asyncHandler(async (req, res) => {
  const { loanId } = req.params;
  const { 
    page = 1, 
    limit = 10, 
    type,
    sortBy = 'transactionDate', 
    sortOrder = 'desc' 
  } = req.query;

  const query = { loanId, ...(type && { type }) };
  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const transactions = await Transaction.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Transaction.countDocuments(query);

  res.json({
    success: true,
    transactions,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTransactions: total
    }
  });
});