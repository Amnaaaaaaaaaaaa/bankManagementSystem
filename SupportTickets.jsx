// src/components/SupportTicket.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SupportTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get(`${"http://localhost:5000/api"}/support-tickets`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then((response) => {
      setTickets(response.data.tickets);
    });
  }, []);

  return (
    <div>
      <h2>Support Tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id}>
            <strong>{ticket.subject}</strong>: {ticket.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SupportTickets;
