const mongoose = require('mongoose');

const satisfactionSchema = new mongoose.Schema({
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = satisfactionSchema