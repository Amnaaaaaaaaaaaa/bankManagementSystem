// controllers/warningController.js
const Warning = require('../models/warningModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const asyncHandler = require('express-async-handler');
const { createAuditLog } = require('./auditLogController');

// @desc    Create a new warning
// @route   POST /api/warnings
// @access  Admin only
exports.createWarning = asyncHandler(async (req, res) => {
    const { user_id, reason } = req.body;

    // Validate user exists
    const user = await User.findById(user_id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Create warning
    const warning = await Warning.create({
        user_id,
        reason,
        reviewed_by: req.user._id
    });

    // Create a notification for the user
    await Notification.create({
        user_id,
        type: 'account-request',
        title: 'Account Warning Issued',
        message: `A warning has been issued for reason: ${reason}`,
        data: [warning._id]
    });

    // Create audit log
    await createAuditLog(
        req.user._id, 
        'CREATE_WARNING', 
        `Issued warning to user ${user_id} - Reason: ${reason}`
    );

    res.status(201).json(warning);
});

// @desc    Get warnings for a specific user
// @route   GET /api/warnings/user/:userId
// @access  Admin only
exports.getUserWarnings = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    // Build query conditions
    const query = { user_id: userId };
    if (status) query.status = status;

    const warnings = await Warning.find(query)
        .populate('user_id', 'name email')
        .populate('reviewed_by', 'name')
        .sort({ issued_at: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Warning.countDocuments(query);

    res.json({
        warnings,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalWarnings: total
    });
});

// @desc    Update warning status
// @route   PATCH /api/warnings/:warningId/status
// @access  Admin only
exports.updateWarningStatus = asyncHandler(async (req, res) => {
    const { warningId } = req.params;
    const { status, action_taken } = req.body;

    const warning = await Warning.findByIdAndUpdate(
        warningId,
        { 
            status, 
            action_taken,
            reviewed_by: req.user._id
        },
        { new: true }
    );

    if (!warning) {
        res.status(404);
        throw new Error('Warning not found');
    }

    // Handle potential actions based on warning status
    if (action_taken === 'suspended') {
        await User.findByIdAndUpdate(warning.user_id, { 
            isActive: false 
        });
    } else if (action_taken === 'account-closed') {
        await User.findByIdAndUpdate(warning.user_id, { 
            isActive: false,
            accountClosed: true 
        });
    }

    // Create a notification for the user
    await Notification.create({
        user_id: warning.user_id,
        type: 'account-request',
        title: 'Warning Status Updated',
        message: `Your warning status has been updated to: ${status}, Action taken: ${action_taken}`,
        data: [warning._id]
    });

    // Create audit log
    await createAuditLog(
        req.user._id, 
        'UPDATE_WARNING', 
        `Updated warning ${warningId} status to ${status}, action: ${action_taken}`
    );

    res.json(warning);
});

// @desc    Get all warnings
// @route   GET /api/warnings
// @access  Admin only
exports.getAllWarnings = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status, reason } = req.query;

    // Build query conditions
    const query = {};
    if (status) query.status = status;
    if (reason) query.reason = reason;

    const warnings = await Warning.find(query)
        .populate('user_id', 'name email')
        .populate('reviewed_by', 'name')
        .sort({ issued_at: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Warning.countDocuments(query);

    res.json({
        warnings,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalWarnings: total
    });
});