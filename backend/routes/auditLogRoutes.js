// routes/auditLogRoutes.js
const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Get all audit logs (admin only)
router.get('/', protect, adminOnly, auditLogController.getAllAuditLogs);

// Get audit logs for a specific user (admin only)
router.get('/user/:userId', protect, adminOnly, auditLogController.getUserAuditLogs);

// Create a new audit log (internal use, not exposed via API)
router.post('/', protect, auditLogController.createAuditLog);

module.exports = router;