// routes/supportTicketRoutes.js
const express = require('express');
const router = express.Router();
const supportTicketController = require('../controllers/supportTicketController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all support tickets (admin only)
router.get('/', protect, adminOnly, supportTicketController.getAllSupportTickets);

// Get support ticket by ID (admin only)
router.get('/:id', protect, adminOnly, supportTicketController.getSupportTicketById);

// Update support ticket status (admin only)
router.patch('/:id/status', protect, adminOnly, supportTicketController.updateSupportTicketStatus);

// Assign support ticket to a representative (admin only)
router.patch('/:id/assign', protect, adminOnly, supportTicketController.assignSupportTicket);

module.exports = router;