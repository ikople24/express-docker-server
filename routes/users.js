const express = require("express");
const router = express.Router();

const requireAuth = require("../middileware/requireAuth");
const usersController = require("../controllers/usersController");

// Create a new user (needs authentication)
router.post("/create", requireAuth, usersController.createUser);

// Get user by Clerk ID (needs authentication)
router.get("/get-by-clerkId", requireAuth, usersController.getUserByClerkId);

module.exports = router;