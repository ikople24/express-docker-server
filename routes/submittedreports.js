const { updateComplaintStatus } = require("../controllers/complaintController");
const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  getSingleReport,
  previewNextComplaintId,
} = require("../controllers/complaintController");

// GET all reports
router.get("/", getReports);

// POST new report
router.post("/", createReport);

// PATCH update status (requires auth)
router.patch("/:id", requireAuth, updateReport);

// DELETE a report
router.delete("/:id", requireAuth, deleteReport);

// GET preview next complaintId
router.get("/preview-id", previewNextComplaintId);

// GET single report by ID
router.get("/:id", getSingleReport);

// PUT update only status
router.put("/update-status/:id", requireAuth, updateComplaintStatus);

module.exports = router;