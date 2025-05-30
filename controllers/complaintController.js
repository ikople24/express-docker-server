// controllers/complaintController.js
const Complaint = require("../models/Complaint");
const { getNextSequence } = require("../utils/getNextSequence");
const mongoose = require("mongoose");

// Get complaints with optional filtering (public or admin)
exports.getReports = async (req, res) => {
  const { category, complaintId, status } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (complaintId) filter.complaintId = complaintId;
  if (status) filter.status = status;

  try {
    let reports = await Complaint.find(filter).sort({ timestamp: -1 });

    // Limit fields for non-authenticated users (public)
    if (!req.user || !req.user.role || req.user.role !== "admin") {
      reports = reports.map(({ _id, complaintId, category, timestamp, location, status }) => ({
        _id, complaintId, category, timestamp, location, status
      }));
    }

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports." });
  }
};

// Create a new complaint
exports.createReport = async (req, res) => {
  try {
    const complaintId = await getNextSequence(mongoose.connection.db, "complaintId");
    const report = new Complaint({ ...req.body, complaintId });
    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ error: "Failed to submit report." });
  }
};

// Update complaint (admin only)
exports.updateReport = async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to update report." });
  }
};


// Delete complaint (admin only)
exports.deleteReport = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete report." });
  }
};

// Get a single complaint by ID
exports.getSingleReport = async (req, res) => {
  try {
    const report = await Complaint.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

    // Restrict fields for non-admin users
    if (!req.user || req.user.role !== "admin") {
      const { _id, complaintId, category, timestamp, location, status, detail, imageUrl } = report;
      return res.json({ _id, complaintId, category, timestamp, location, status, detail, imageUrl });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch report." });
  }
};
