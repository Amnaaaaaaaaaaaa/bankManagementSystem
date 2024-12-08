//notificationModel.js
const mongoose = require("mongoose");

// Define Notification Schema
const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Referencing User ID
      ref: "User",
      required: [true, "Please Provide the User ID for the Notification!"],
    },
    type: {
      type: String,
      required: [true, "Please Provide Notification Type"],
      enum: {
        values: ["approved", "declined", "account-request", "transfered-in"],
        message: "{VALUE} is not supported as a notification type",
      },
    },
    title: {
      type: String,
      required: [true, "Please Provide Notification Title"],
    },
    message: {
      type: String,
      required: [true, "Please Provide Notification Message"],
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create the Notification model
const Notification = mongoose.model("Notification", notificationSchema);

// Export the model
module.exports = Notification;
