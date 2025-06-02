const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  solution: {
    type: String,
    default: "",
  },
  solutionImages: {
    type: [String],
    default: [],
  },
  completedAt: {
    type: Date,
  },
  note: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Assignment", AssignmentSchema, "assignments");
