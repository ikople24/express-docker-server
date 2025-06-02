const express = require('express');
const router = express.Router();

const requireAuth = require('../middleware/requireAuth');
const assignmentsController = require('../controllers/assignmentsController');
const Assignment = require('../models/Assignment');

//create a new assignment
router.post('/create', requireAuth, assignmentsController.createAssignment);

router.put("/:id", async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ error: "Failed to update assignment" });
  }
});

// GET all assignments
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find({});
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

module.exports = router;