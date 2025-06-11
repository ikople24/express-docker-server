const getDbConnection = require("../utils/dbManager");
const complaintSchema = require("../models/Complaint");
const { getNextSequence } = require("../utils/getNextSequence");
const mongoose = require("mongoose");

// Update only location by _id (for admin use)
exports.updateLocation = async (req, res) => {
  try {
    const { location } = req.body;
    const conn = await getDbConnection(req.appId);
    const Complaint = conn.model("Complaint", complaintSchema);
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { location },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "ไม่พบข้อมูลสำหรับอัปเดต" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "ไม่สามารถอัปเดต location ได้" });
  }
};
// Get personal info by _id
exports.getPersonalInfo = async (req, res) => {
  try {
    const conn = await getDbConnection(req.appId);
    const Complaint = conn.model("Complaint", complaintSchema);
    const report = await Complaint.findById(req.params.id).select("fullName phone location");
    if (!report) {
      return res.status(404).json({ error: "ไม่พบข้อมูลผู้แจ้ง" });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลผู้แจ้งได้" });
  }
};
// Preview next complaintId (for frontend display only, does NOT increment counter)
exports.previewNextComplaintId = async (req, res) => {
  try {
    const conn = await getDbConnection(req.appId);
    const counters = conn.db.collection("counters");
    console.log("📦 DB Ready:", !!counters);

    const latest = await counters.findOne({ _id: "complaintId" });
    console.log("🔍 Latest Counter:", latest);

    const nextSeq = (latest?.sequence_value || 0) + 1;
    const nextId = `CMP-${nextSeq.toString().padStart(6, "0")}`;
    console.log("➡️ Previewing nextId:", nextId);g

    res.json({ nextId });
  } catch (error) {
    res.status(500).json({ error: "Failed to preview next complaint ID." });
  }
};
// Get complaints with optional filtering (public or admin)
exports.getReports = async (req, res) => {
  const { category, complaintId, status } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (complaintId) filter.complaintId = complaintId;
  filter.status = status || "อยู่ระหว่างดำเนินการ";

  console.log("my is controller reports");
  try {
    const conn = await getDbConnection(req.appId);
    const Complaint = conn.model("Complaint", complaintSchema);

    let reports = await Complaint.find(filter).sort({ timestamp: -1 });
    // Limit fields for non-authenticated users (public)
    if (!req.user || !req.user.role || req.user.role !== "admin") {
      reports = reports.map(({ _id, complaintId, category, timestamp, location, status, detail, imageUrl, community }) => ({
        _id, complaintId, category, timestamp, location, status, detail, imageUrl, community
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
    const conn = await getDbConnection(req.appId);
    const Complaint = conn.model("Complaint", complaintSchema);

    const complaintId = await getNextSequence(conn.db, "complaintId");
    const report = new Complaint({ ...req.body, complaintId });
    const savedReport = await report.save();
    res.status(201).json({ complaintId: savedReport.complaintId });
  } catch (error) {
    res.status(400).json({ error: "Failed to submit report." });
  }
};

// Update complaint (admin only)
exports.updateReport = async (req, res) => {
  try {
    const conn = await getDbConnection(req.appId);
    const Complaint = conn.model("Complaint", complaintSchema);

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
    const conn = await getDbConnection(req.appId);
    const Complaint = conn.model("Complaint", complaintSchema);

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete report." });
  }
};

// Get a single complaint by ID
exports.getSingleReport = async (req, res) => {
  try {
    const conn = await getDbConnection(req.appId);
    const Complaint = conn.model("Complaint", complaintSchema);

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


// Update complaint status only (ปิดเรื่อง)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const conn = await getDbConnection(req.appId);
    const Complaint = conn.model("Complaint", complaintSchema);

    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "ไม่พบข้อมูลที่ต้องการอัปเดต" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "อัปเดตสถานะไม่สำเร็จ" });
  }
};

exports.submitReport = async (req, res) => {
  try {
    const conn = await getDbConnection(req.appId);
    const Complaint = conn.model("Complaint", complaintSchema);

    const complaintId = await getNextSequence(conn.db, "complaintId");
    const report = new Complaint({ ...req.body, complaintId });
    const savedReport = await report.save();
    res.status(201).json({ complaintId: savedReport.complaintId });
  } catch (error) {
    res.status(400).json({ error: "Failed to submit report." });
  }
};