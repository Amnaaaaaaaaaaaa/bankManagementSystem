//auditLogModel.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: String }, // Additional details about the action
});

module.exports = mongoose.model('AuditLog', auditLogSchema);