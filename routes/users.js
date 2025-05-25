const clerkClient = require('@clerk/clerk-sdk-node');
const express = require("express");
const fetch = require("node-fetch");
const axios = require("axios");
const User = require("../models/Users.js");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);

    const existingUser = await User.findOne({ clerkId: req.body.clerkId });
    if (existingUser) {
      return res.status(409).json({ success: false, error: "duplicate_clerk_id", message: "Clerk ID นี้มีอยู่แล้ว" });
    }

    const user = new User(req.body);
    const result = await user.save();

    try {
      const updatedUser = await clerkClient.users.updateUser(req.body.clerkId, {
        publicMetadata: {
          role: req.body.role || "admin",
        },
      });
      console.log("✅ Clerk updated:", updatedUser.id);
    } catch (err) {
      console.error("❌ Clerk update failed:", err.message);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: "duplicate_key", message: "มีข้อมูลผู้ใช้นี้ในระบบแล้ว" });
    }
    return res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
});

router.get("/get-by-clerkId", async (req, res) => {
  try {
    const { clerkId } = req.query;
    if (!clerkId) {
      return res.status(400).json({ success: false, message: "Missing clerkId" });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("GET USER ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;