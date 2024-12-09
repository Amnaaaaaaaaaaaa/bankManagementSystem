//warningModel.js
const mongoose = require("mongoose");

// Define Warning Schema
const warningSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a User ID."],
    },
    reason: {
      type: String,
      required: [true, "Please provide a reason for the warning."],
      enum: ["wrong-password", "suspicious-activity", "policy-violation"],
    },
    status: {
      type: String,
      default: "pending", // pending, reviewed, dismissed
      enum: ["pending", "reviewed", "dismissed"],
    },
    issued_at: {
      type: Date,
      default: Date.now,
    },
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin ID
    },
    action_taken: {
      type: String,
      enum: ["none", "suspended", "warning-issued", "account-closed"],
      default: "none",
    },
  },
  {
    timestamps: true,
    collection: "Warnings",
  }
);

// Create the Warning model
const Warning = mongoose.model("Warning", warningSchema);

// Export the model
module.exports = Warning;
