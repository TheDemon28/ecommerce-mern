const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true },

    subject: { type: String, required: true },

    message: { type: String, required: true },

    resolved: { type: Boolean, default: false },

    response: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Support", supportSchema);
