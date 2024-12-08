// routes/warningRoutes.js
const express = require('express');
const router = express.Router();
const warningController = require('../controllers/warningController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Create a new warning
router.post('/', protect, adminOnly, warningController.createWarning);

// Get warnings for a specific user
router.get('/user/:userId', protect, adminOnly, warningController.getUserWarnings);

// Update warning status
router.patch('/:warningId/status', protect, adminOnly, warningController.updateWarningStatus);

// Get all active warnings
router.get('/', protect, adminOnly, warningController.getAllWarnings);

module.exports = router;