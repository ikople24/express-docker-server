const mongoose = require('mongoose');

const AdminOptionSchema = new mongoose.Schema({
  menu_category: { type: String, required: true },
  label: { type: String, required: true },
  icon_url: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports =  AdminOptionSchema ;