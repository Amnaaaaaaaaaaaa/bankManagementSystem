// // controllers/notificationController.js
// const Notification = require('../models/notificationModel');
// const User = require('../models/userModel');
// const asyncHandler = require('express-async-handler');
// const { createAuditLog } = require('./auditLogController');

// // @desc    Create a new notification
// // @route   POST /api/notifications
// // @access  Admin only
// exports.createNotification = asyncHandler(async (req, res) => {
//     const { user_id, type, title, message, data } = req.body;

//     // Validate user exists
//     const user = await User.findById(user_id);
//     if (!user) {
//         res.status(404);
//         throw new Error('User not found');
//     }

//     // Create notification
//     const notification = await Notification.create({
//         user_id,
//         type,
//         title,
//         message,
//         data: data || []
//     });

//     // Create audit log
//     await createAuditLog(
//         req.user._id, 
//         'CREATE_NOTIFICATION', 
//         `Created notification for user ${user_id} - Type: ${type}`
//     );

//     res.status(201).json(notification);
// });

// // @desc    Get notifications for a specific user
// // @route   GET /api/notifications/user/:userId
// // @access  Authenticated users
// exports.getUserNotifications = asyncHandler(async (req, res) => {
//     const { userId } = req.params;
//     const { page = 1, limit = 10, seen } = req.query;

//     // Build query conditions
//     const query = { user_id: userId };
//     if (seen !== undefined) {
//         query.isSeen = seen === 'true';
//     }

//     const notifications = await Notification.find(query)
//         .sort({ createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit));

//     const total = await Notification.countDocuments(query);

//     res.json({
//         notifications,
//         currentPage: page,
//         totalPages: Math.ceil(total / limit),
//         totalNotifications: total
//     });
// });

// // @desc    Mark a specific notification as seen
// // @route   PATCH /api/notifications/:notificationId/seen
// // @access  Authenticated users
// exports.markNotificationAsSeen = asyncHandler(async (req, res) => {
//     const { notificationId } = req.params;

//     const notification = await Notification.findByIdAndUpdate(
//         notificationId,
//         { isSeen: true },
//         { new: true }
//     );

//     if (!notification) {
//         res.status(404);
//         throw new Error('Notification not found');
//     }

//     res.json(notification);
// });

// // @desc    Mark all notifications as seen for a user
// // @route   PATCH /api/notifications/user/:userId/mark-all-seen
// // @access  Authenticated users
// exports.markAllNotificationsAsSeen = asyncHandler(async (req, res) => {
//     const { userId } = req.params;

//     const result = await Notification.updateMany(
//         { user_id: userId, isSeen: false },
//         { isSeen: true }
//     );

//     res.json({
//         message: `${result.modifiedCount} notifications marked as seen`
//     });
// });

// // @desc    Delete a specific notification
// // @route   DELETE /api/notifications/:notificationId
// // @access  Authenticated users
// exports.deleteNotification = asyncHandler(async (req, res) => {
//     const { notificationId } = req.params;

//     const notification = await Notification.findByIdAndDelete(notificationId);

//     if (!notification) {
//         res.status(404);
//         throw new Error('Notification not found');
//     }

//     // Create audit log
//     await createAuditLog(
//         req.user._id, 
//         'DELETE_NOTIFICATION', 
//         `Deleted notification ${notificationId}`
//     );

//     res.json({ message: 'Notification deleted successfully' });
// });

// // @desc    Get unread notifications count for a user
// // @route   GET /api/notifications/user/:userId/unread-count
// // @access  Authenticated users
// exports.getUnreadNotificationsCount = asyncHandler(async (req, res) => {
//     const { userId } = req.params;

//     const unreadCount = await Notification.countDocuments({
//         user_id: userId,
//         isSeen: false
//     });

//     res.json({ unreadCount });
// });
const Notification = require('../models/notificationModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { createAuditLog } = require('./auditLogController');

// Notification Template Management
exports.createNotificationTemplate = asyncHandler(async (req, res) => {
    const { type, title, message, channel, priority } = req.body;

    const template = await Notification.create({
        type,
        title,
        message,
        isTemplate: true,
        channel,
        priority
    });

    res.status(201).json(template);
});

exports.getNotificationTemplates = asyncHandler(async (req, res) => {
    const templates = await Notification.find({ isTemplate: true });
    res.json(templates);
});

exports.updateNotificationTemplate = asyncHandler(async (req, res) => {
    const { templateId } = req.params;
    const { type, title, message, channel, priority } = req.body;

    const template = await Notification.findByIdAndUpdate(
        templateId,
        { type, title, message, channel, priority },
        { new: true }
    );

    if (!template) {
        res.status(404);
        throw new Error('Notification template not found');
    }

    res.json(template);
});

exports.deleteNotificationTemplate = asyncHandler(async (req, res) => {
    const { templateId } = req.params;

    const template = await Notification.findByIdAndDelete(templateId);

    if (!template) {
        res.status(404);
        throw new Error('Notification template not found');
    }

    res.json({ message: 'Notification template deleted successfully' });
});

// Existing createNotification method remains the same

// User Notification Preferences
exports.updateUserNotificationPreferences = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { preferredChannels, blockedTypes } = req.body;

    const user = await User.findByIdAndUpdate(
        userId,
        { 
            notificationPreferences: {
                preferredChannels,
                blockedTypes
            }
        },
        { new: true }
    );

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json(user.notificationPreferences);
});

exports.getUserNotificationPreferences = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json(user.notificationPreferences || {});
});

// Event Trigger Notification System
exports.triggerEventNotification = asyncHandler(async (req, res) => {
    const { 
        eventType, 
        affectedUsers, 
        templateId, 
        additionalData 
    } = req.body;

    // Find the notification template
    const template = await Notification.findById(templateId);
    if (!template) {
        res.status(404);
        throw new Error('Notification template not found');
    }

    // Create notifications for affected users
    const notifications = await Promise.all(
        affectedUsers.map(async (userId) => {
            return Notification.create({
                user_id: userId,
                type: template.type,
                title: template.title,
                message: template.message,
                data: additionalData || [],
                channel: template.channel
            });
        })
    );

    res.status(201).json({
        message: `Triggered notifications for ${notifications.length} users`,
        notifications
    });
});

// Existing methods remain the same (getUserNotifications, markNotificationAsSeen, etc.)
exports.getUserNotifications = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10, seen } = req.query;

    // Build query conditions
    const query = { user_id: userId };
    if (seen !== undefined) {
        query.isSeen = seen === 'true';
    }

    const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Notification.countDocuments(query);

    res.json({
        notifications,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotifications: total
    });
});

// @desc    Mark a specific notification as seen
// @route   PATCH /api/notifications/:notificationId/seen
// @access  Authenticated users
exports.markNotificationAsSeen = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isSeen: true },
        { new: true }
    );

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    res.json(notification);
});

// @desc    Mark all notifications as seen for a user
// @route   PATCH /api/notifications/user/:userId/mark-all-seen
// @access  Authenticated users
exports.markAllNotificationsAsSeen = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const result = await Notification.updateMany(
        { user_id: userId, isSeen: false },
        { isSeen: true }
    );

    res.json({
        message: `${result.modifiedCount} notifications marked as seen`
    });
});

// @desc    Delete a specific notification
// @route   DELETE /api/notifications/:notificationId
// @access  Authenticated users
exports.deleteNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    // Create audit log
    await createAuditLog(
        req.user._id, 
        'DELETE_NOTIFICATION', 
        `Deleted notification ${notificationId}`
    );

    res.json({ message: 'Notification deleted successfully' });
});

// @desc    Get unread notifications count for a user
// @route   GET /api/notifications/user/:userId/unread-count
// @access  Authenticated users
exports.getUnreadNotificationsCount = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const unreadCount = await Notification.countDocuments({
        user_id: userId,
        isSeen: false
    });

    res.json({ unreadCount });
});

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Admin only
exports.createNotification = asyncHandler(async (req, res) => {
    const { user_id, type, title, message, data } = req.body;

    // Validate user exists
    const user = await User.findById(user_id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Create notification
    const notification = await Notification.create({
        user_id,
        type,
        title,
        message,
        data: data || []
    });

    // Create audit log
    await createAuditLog(
        req.user._id, 
        'CREATE_NOTIFICATION', 
        `Created notification for user ${user_id} - Type: ${type}`
    );

    res.status(201).json(notification);
});