import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    preferredChannels: ['in-app'],
    blockedTypes: []
  });

  // Base API URL - make sure this matches your backend setup
  const BASE_API_URL = 'http://localhost:5000/api/notifications';

  // Fetch user notifications
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      console.error('No user ID or token found');
      return;
    }

    // Fetch notifications
    axios.get(`${BASE_API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      setNotifications(response.data.notifications);
    }).catch((error) => {
      console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
    });

    // Fetch user notification preferences
    axios.get(`${BASE_API_URL}/user/${userId}/preferences`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      setPreferences(response.data);
    }).catch((error) => {
      console.error('Error fetching preferences:', error.response ? error.response.data : error.message);
    });
  }, []);

  // Update notification preferences
  const updatePreferences = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        `${BASE_API_URL}/user/${userId}/preferences`, 
        preferences,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPreferences(response.data);
    } catch (error) {
      console.error('Failed to update preferences', error.response ? error.response.data : error.message);
    }
  };

  // Mark notification as seen
  const markAsSeen = async (notificationId) => {
    const token = localStorage.getItem('token');

    try {
      await axios.patch(
        `${BASE_API_URL}/${notificationId}/seen`, 
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setNotifications(notifications.map(notification => 
        notification._id === notificationId 
          ? { ...notification, isSeen: true } 
          : notification
      ));
    } catch (error) {
      console.error('Failed to mark notification as seen', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h2>Notifications</h2>
      
      {/* Notification Preferences */}
      <div>
        <h3>Notification Preferences</h3>
        <div>
          <label>Preferred Channels:</label>
          {['email', 'sms', 'push', 'in-app'].map(channel => (
            <label key={channel}>
              <input
                type="checkbox"
                checked={preferences.preferredChannels.includes(channel)}
                onChange={(e) => {
                  const updatedChannels = e.target.checked
                    ? [...preferences.preferredChannels, channel]
                    : preferences.preferredChannels.filter(c => c !== channel);
                  setPreferences({ ...preferences, preferredChannels: updatedChannels });
                }}
              />
              {channel}
            </label>
          ))}
        </div>
        <button onClick={updatePreferences}>Save Preferences</button>
      </div>

      {/* Notifications List */}
      <ul>
        {notifications.map((notification) => (
          <li 
            key={notification._id}
            style={{ 
              fontWeight: notification.isSeen ? 'normal' : 'bold',
              backgroundColor: notification.priority === 'high' ? '#ffdddd' : 'transparent'
            }}
          >
            <strong>{notification.title}</strong>: {notification.message}
            {!notification.isSeen && (
              <button onClick={() => markAsSeen(notification._id)}>
                Mark as Seen
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;