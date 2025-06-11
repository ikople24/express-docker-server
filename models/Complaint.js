const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true },
    fullName: String,
    phone: String,
    community: String,
    category: String,
    problems: [String],
    images: [String],
    detail: String,
    location: {
      lat: Number,
      lng: Number,
    },
    status: { type: String, default: "อยู่ระหว่างดำเนินการ" },
    officer: String,
  },
  {
    collection: "submittedreports",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
  }
);

module.exports = complaintSchema ;