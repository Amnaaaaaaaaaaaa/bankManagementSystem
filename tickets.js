//src/api/tickets.js
import axios from 'axios';
import { API_URL } from './config';

export const getSupportTickets = () =>
  axios.get(`${"http://localhost:5000/api"}/support-tickets`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

export const createTicket = (data) =>
  axios.post(`${"http://localhost:5000/api"}/support-tickets`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
