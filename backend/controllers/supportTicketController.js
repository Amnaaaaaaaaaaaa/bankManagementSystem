// controllers/supportTicketController.js
const SupportTicket = require('../models/supportTicketModel');
const asyncHandler = require('express-async-handler');
const { createAuditLog } = require('./auditLogController');

// @desc    Get all support tickets
// @route   GET /api/support-tickets
// @access  Admin only
exports.getAllSupportTickets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    // Build query conditions
    const query = {};
    if (status) query.status = status;

    const tickets = await SupportTicket.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await SupportTicket.countDocuments(query);

    res.json({
        tickets,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalTickets: total
    });
});

// @desc    Get support ticket by ID
// @route   GET /api/support-tickets/:id
// @access  Admin only
exports.getSupportTicketById = asyncHandler(async (req, res) => {
    const ticket = await SupportTicket.findById(req.params.id)
        .populate('userId', 'name email');

    if (!ticket) {
        res.status(404);
        throw new Error('Support ticket not found');
    }

    res.json(ticket);
});

// @desc    Update support ticket status
// @route   PATCH /api/support-tickets/:id/status
// @access  Admin only
exports.updateSupportTicketStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
        req.params.id, 
        { status, updatedAt: Date.now() },
        { new: true }
    );

    if (!ticket) {
        res.status(404);
        throw new Error('Support ticket not found');
    }

    // Create audit log
    await createAuditLog(
        req.user._id, 
        'UPDATE_SUPPORT_TICKET_STATUS', 
        `Updated ticket ${ticket._id} status to ${status}`
    );

    res.json(ticket);
});

// @desc    Assign support ticket to a representative
// @route   PATCH /api/support-tickets/:id/assign
// @access  Admin only
exports.assignSupportTicket = asyncHandler(async (req, res) => {
    const { representativeId } = req.body;
    
    const ticket = await SupportTicket.findByIdAndUpdate(
        req.params.id,
        { 
            assignedTo: representativeId,
            status: 'in-progress',
            updatedAt: Date.now()
        },
        { new: true }
    );

    if (!ticket) {
        res.status(404);
        throw new Error('Support ticket not found');
    }

    // Create audit log
    await createAuditLog(
        req.user._id, 
        'ASSIGN_SUPPORT_TICKET', 
        `Assigned ticket ${ticket._id} to representative ${representativeId}`
    );

    res.json(ticket);
});