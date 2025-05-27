const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
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
    timestamp: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "submittedreports" }
);

module.exports = mongoose.model("Complaint", complaintSchema);