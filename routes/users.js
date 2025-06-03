const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const requireAuth = require("../middleware/requireAuth");

// Create a new user (no authentication required, prevents duplicate clerkId)
router.post("/create", usersController.createUser);

// Get user by Clerk ID (needs authentication)
router.get("/get-by-clerkId", requireAuth, usersController.getUserByClerkId);

module.exports = router;