const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String },
  role: { type: String },
  profileUrl: { type: String },
  phone: { type: String },
  clerkId: { type: String, required: true, unique: true },
  assignedTask: { type: [String], default: [] },
  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);