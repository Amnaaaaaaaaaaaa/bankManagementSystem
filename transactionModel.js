const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ['PAYMENT', 'DISBURSEMENT'],
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'PENDING'],
      default: 'COMPLETED',
    },
  },
  { timestamps: true }
);

// Use this to prevent re-compilation
module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);