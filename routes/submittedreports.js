const express = require("express");
const router = express.Router();
const requireAuth = require("../middileware/requireAuth");
const {
  getReports,
  createReport,
  updateReport,
  deleteReport,
  getSingleReport,
} = require("../controllers/complaintController");

// GET all reports
router.get("/", getReports);

// POST new report
router.post("/", createReport);

// PATCH update status (requires auth)
router.patch("/:id", requireAuth, updateReport);

// DELETE a report
router.delete("/:id", requireAuth, deleteReport);

// GET single report by ID
router.get("/:id", getSingleReport);

module.exports = router;