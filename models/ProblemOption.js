const mongoose = require("mongoose");

const problemOptionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  iconUrl: { type: String, default: "" },
  category: { type: String, default: "" },
  active: { type: Boolean, default: true }
});

module.exports = problemOptionSchema;