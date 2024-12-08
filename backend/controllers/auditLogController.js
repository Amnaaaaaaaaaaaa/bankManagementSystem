// controllers/auditLogController.js
const AuditLog = require('../models/auditLogModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all audit logs
// @route   GET /api/audit-logs
// @access  Admin only
exports.getAllAuditLogs = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    // Build query conditions
    const query = {};
    if (startDate && endDate) {
        query.timestamp = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    const logs = await AuditLog.find(query)
        .populate('userId', 'name email') // Populate user details
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await AuditLog.countDocuments(query);

    res.json({
        logs,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLogs: total
    });
});

// @desc    Get audit logs for a specific user
// @route   GET /api/audit-logs/user/:userId
// @access  Admin only
exports.getUserAuditLogs = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const logs = await AuditLog.find({ userId })
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await AuditLog.countDocuments({ userId });

    res.json({
        logs,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalLogs: total
    });
});

// @desc    Create a new audit log
// @access  Internal use
exports.createAuditLog = asyncHandler(async (userId, action, details) => {
    const auditLog = await AuditLog.create({
        userId,
        action,
        details
    });

    return auditLog;
});