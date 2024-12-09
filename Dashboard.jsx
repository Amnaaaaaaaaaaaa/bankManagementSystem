// src/components/Dashboard.jsx

import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Loans from './Loans';
import Notifications from './Notifications';
import SupportTickets from './SupportTickets';
import CreditScore from './CreditScore';
import "./Dashboard.css";

function Dashboard() {
  // Retrieve the userId from localStorage
  const userId = localStorage.getItem('userId');

  return (
    <div className="dashboard">
      <nav>
        <Link to="loans">Loans</Link>
        <Link to="notifications">Notifications</Link>
        <Link to="support-tickets">Support Tickets</Link>
        <Link to="credit-score">Credit Score</Link>
      </nav>
      <Routes>
        <Route path="loans" element={<Loans />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="support-tickets" element={<SupportTickets />} />
        <Route path="credit-score" element={<CreditScore userId={userId} />} />
      </Routes>
    </div>
  );
}

export default Dashboard;
