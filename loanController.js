//loanController.js
const Loan = require('../models/loanModel');
const Transaction = require('../models/transactionModel');
const asyncHandler = require('express-async-handler');

// @desc    Create a new loan
// @route   POST /api/loans
// @access  Admin/User
exports.createLoan = asyncHandler(async (req, res) => {
  const { borrowerName, amount, interestRate, termInMonths } = req.body;

  const loan = new Loan({
    borrowerName,
    amount,
    interestRate,
    termInMonths
  });

  await loan.save();

  res.status(201).json({
    success: true,
    message: 'Loan application submitted successfully',
    loan
  });
});

// @desc    Get all loans
// @route   GET /api/loans
// @access  Admin
exports.getAllLoans = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    sortBy = 'createdAt', 
    sortOrder = 'desc' 
  } = req.query;

  const query = status ? { status } : {};
  const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const loans = await Loan.find(query)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Loan.countDocuments(query);

  res.json({
    success: true,
    loans,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalLoans: total
    }
  });
});

// @desc    Get loan details with transactions
// @route   GET /api/loans/:loanId
// @access  Admin/User
exports.getLoanDetails = asyncHandler(async (req, res) => {
  const { loanId } = req.params;

  const loan = await Loan.findById(loanId);
  if (!loan) {
    return res.status(404).json({ 
      success: false, 
      message: 'Loan not found' 
    });
  }

  const transactions = await Transaction.find({ loanId })
    .sort({ transactionDate: -1 });

  res.json({
    success: true,
    loan,
    transactions
  });
});

// @desc    Update loan status
// @route   PATCH /api/loans/:loanId/status
// @access  Admin
exports.updateLoanStatus = asyncHandler(async (req, res) => {
  const { loanId } = req.params;
  const { status, rejectionReason } = req.body;

  const updateData = { status };
  if (status === 'REJECTED') updateData.rejectionReason = rejectionReason;

  const loan = await Loan.findByIdAndUpdate(loanId, updateData, { new: true });

  if (!loan) {
    return res.status(404).json({ success: false, message: 'Loan not found' });
  }

  res.json({
    success: true,
    message: `Loan status updated to ${status}`,
    loan,
  });
});
