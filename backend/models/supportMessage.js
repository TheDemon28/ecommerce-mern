// backend/models/supportMessage.js
const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    subject: String,
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SupportMessage",
  supportMessageSchema
);