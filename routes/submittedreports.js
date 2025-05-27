const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const requireAuth = require("../middileware/requireAuth");

// GET all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Complaint.find({}).sort({ timestamp: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports." });
  }
});

// POST new report
router.post("/", async (req, res) => {
  console.log("📥 Incoming Report Data:", req.body);
  try {
    const report = new Complaint(req.body);
    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ error: "Failed to submit report." });
  }
});

// PATCH update status (requires auth)
router.patch("/:id", requireAuth, async (req, res) => {
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
});

// DELETE a report
router.delete("/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete report." });
  }
});

module.exports = router;