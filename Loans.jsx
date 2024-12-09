import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate

function Loans() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    console.log('Token:', token);
    console.log('User Role from localStorage:', userRole);

    axios.get('http://localhost:5000/api/loans', {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
    .then((response) => {
      console.log('Loans Response:', response);
      setLoans(response.data.loans || []);
    })
    .catch((error) => {
      console.error('Loans Fetch Error:', error);
      
      if (error.response) {
        console.log('Error Response:', error.response);
        setError(`Server Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        setError('No response received from server. Check your network connection.');
      } else {
        setError(`Error: ${error.message}`);
      }
    });
  }, [navigate]);

  // Error handling
  if (error) {
    return <div style={{color: 'red'}}>{error}</div>;
  }

  // Loans display
  return (
    <div>
      <h2>Loans (Admin View)</h2>
      {loans.length === 0 ? (
        <p>No loans found.</p>
      ) : (
        loans.map((loan) => (
          <div key={loan.id || Math.random()}>
            {loan.borrowerName} - ${loan.amount}
          </div>
        ))
      )}
    </div>
  );
}

export default Loans;