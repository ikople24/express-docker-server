const express = require("express");
const router = express.Router();
const {
  createSatisfaction,
  getSatisfactions,
  getSatisfactionByComplaintId,
} = require("../controllers/satisfactionController");

// POST: Create new satisfaction entry
router.post("/", createSatisfaction);

// GET: Retrieve satisfactions for a specific complaintId, limit to 4
router.get("/:complaintId", getSatisfactionByComplaintId);

// Optional: GET all (keep if needed)
router.get("/", getSatisfactions);

module.exports = router;
