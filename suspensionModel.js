//suspensionModel.js
const mongoose = require("mongoose");

// Define the Suspension Schema
const suspensionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a User ID."],
    },
    reason: {
      type: String,
      required: [true, "Please provide a reason for the suspension."],
    },
    issued_at: {
      type: Date,
      default: Date.now,
    },
    suspension_lifted_at: Date,
    status: {
      type: String,
      default: "active", // active, lifted
      enum: ["active", "lifted"],
    },
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin ID
    },
  },
  {
    timestamps: true,
    collection: "Suspensions",
  }
);

// Create and export the model
const Suspension = mongoose.model("Suspension", suspensionSchema);
module.exports = Suspension;
