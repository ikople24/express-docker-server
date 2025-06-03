const express = require("express");
const router = express.Router();
const User = require("../models/Users");

// Create a new user (no authentication required, prevents duplicate clerkId)
router.post("/create", async (req, res) => {
  try {
    const { clerkId, name, position, department, role, phone, profileUrl, assignedTask } = req.body;

    if (!clerkId) {
      return res.status(400).json({ success: false, message: "Missing Clerk ID." });
    }

    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return res.status(200).json({ success: true, user: existingUser });
    }

    const newUser = new User({
      clerkId,
      name,
      position,
      department,
      role,
      phone,
      profileUrl,
      assignedTask,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ success: true, user: savedUser });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user by Clerk ID (needs authentication)
const requireAuth = require("../middleware/requireAuth");
const usersController = require("../controllers/usersController");
router.get("/get-by-clerkId", requireAuth, usersController.getUserByClerkId);

module.exports = router;