//src/api/notifications.js
import axios from 'axios';

export const getNotifications = (userId) =>
  axios.get(`${"http://localhost:5000/api"}/notifications/user/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

export const markAsRead = (notificationId) =>
  axios.patch(`${"http://localhost:5000/api"}/notifications/${notificationId}/seen`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
