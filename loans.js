//src/api/loans.js
import axios from 'axios';

// Fetch all loans
export const getLoans = () =>
  axios.get(`${"http://localhost:5000/api"}/loans`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

// Fetch loan details including transactions
export const getLoanDetails = (loanId) =>
  axios.get(`${"http://localhost:5000/api"}/loans/${loanId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

// Create a new loan
export const createLoan = (data) =>
  axios.post(`${"http://localhost:5000/api"}/loans`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

// Update loan status (Admin Only)

  export const updateLoanStatus = (loanId, data) =>
    axios.patch(`${"http://localhost:5000/api"}/loans/${loanId}/status`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  