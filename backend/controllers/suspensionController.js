// controllers/suspensionController.js
const Suspension = require('../models/suspensionModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { createAuditLog } = require('./auditLogController');

// @desc    Create a new user suspension
// @route   POST /api/suspensions
// @access  Admin only
exports.createSuspension = asyncHandler(async (req, res) => {
    const { user_id, reason } = req.body;

    // Check if user exists
    const user = await User.findById(user_id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Check if user is already suspended
    const existingSuspension = await Suspension.findOne({
        user_id,
        status: 'active'
    });

    if (existingSuspension) {
        res.status(400);
        throw new Error('User is already suspended');
    }

    // Create suspension
    const suspension = await Suspension.create({
        user_id,
        reason,
        reviewed_by: req.user._id
    });

    // Update user status
    await User.findByIdAndUpdate(user_id, { 
        isActive: false,
        suspendedUntil: null // Optional: you might want to add a duration
    });

    // Create audit log
    await createAuditLog(
        req.user._id, 
        'USER_SUSPENSION', 
        `Suspended user ${user_id} - Reason: ${reason}`
    );

    res.status(201).json(suspension);
});

// @desc    Get all active suspensions
// @route   GET /api/suspensions
// @access  Admin only
exports.getAllSuspensions = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const suspensions = await Suspension.find({ status: 'active' })
        .populate('user_id', 'name email')
        .populate('reviewed_by', 'name')
        .sort({ issued_at: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Suspension.countDocuments({ status: 'active' });

    res.json({
        suspensions,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSuspensions: total
    });
});

// @desc    Get suspension by user ID
// @route   GET /api/suspensions/user/:userId
// @access  Admin only
exports.getSuspensionByUserId = asyncHandler(async (req, res) => {
    const suspension = await Suspension.findOne({
        user_id: req.params.userId,
        status: 'active'
    }).populate('user_id', 'name email');

    if (!suspension) {
        return res.status(404).json({ message: 'No active suspension found for this user' });
    }

    res.json(suspension);
});

// @desc    Lift a suspension
// @route   PATCH /api/suspensions/:suspensionId/lift
// @access  Admin only
exports.liftSuspension = asyncHandler(async (req, res) => {
    const suspension = await Suspension.findByIdAndUpdate(
        req.params.suspensionId,
        { 
            status: 'lifted', 
            suspension_lifted_at: Date.now(),
            reviewed_by: req.user._id
        },
        { new: true }
    );

    if (!suspension) {
        res.status(404);
        throw new Error('Suspension not found');
    }

    // Reactivate user
    await User.findByIdAndUpdate(suspension.user_id, { 
        isActive: true,
        suspendedUntil: null
    });

    // Create audit log
    await createAuditLog(
        req.user._id, 
        'USER_SUSPENSION_LIFTED', 
        `Lifted suspension for user ${suspension.user_id}`
    );

    res.json(suspension);
});