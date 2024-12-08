// routes/suspensionRoutes.js
const express = require('express');
const router = express.Router();
const suspensionController = require('../controllers/suspensionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Create a new user suspension
router.post('/', protect, adminOnly, suspensionController.createSuspension);

// Get all active suspensions
router.get('/', protect, adminOnly, suspensionController.getAllSuspensions);

// Get suspension by user ID
router.get('/user/:userId', protect, adminOnly, suspensionController.getSuspensionByUserId);

// Lift a suspension
router.patch('/:suspensionId/lift', protect, adminOnly, suspensionController.liftSuspension);

module.exports = router;