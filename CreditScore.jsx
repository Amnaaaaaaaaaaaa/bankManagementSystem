import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreditScore({ userId }) {
  const [creditScore, setCreditScore] = useState(null);

  useEffect(() => {
    axios.get(`${"http://localhost:5000/api"}/users/${userId}/credit-score`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((res) => setCreditScore(res.data.creditScore));
  }, [userId]);

  return (
    <div>
      <h3>Credit Score: {creditScore}</h3>
    </div>
  );
}

export default CreditScore;
