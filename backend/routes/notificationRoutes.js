// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Create a new notification (admin only)
router.post('/', protect, adminOnly, notificationController.createNotification);

// Get notifications for a specific user
router.get('/user/:userId', protect, notificationController.getUserNotifications);

// Mark a specific notification as seen
router.patch('/:notificationId/seen', protect, notificationController.markNotificationAsSeen);

// Mark all notifications as seen for a user
router.patch('/user/:userId/mark-all-seen', protect, notificationController.markAllNotificationsAsSeen);

// Delete a specific notification
router.delete('/:notificationId', protect, notificationController.deleteNotification);

// Get unread notifications count for a user
router.get('/user/:userId/unread-count', protect, notificationController.getUnreadNotificationsCount);

module.exports = router;