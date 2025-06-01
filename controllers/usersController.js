const User = require("../models/Users");
const clerkClient = require("@clerk/clerk-sdk-node");

// Create a new user (requires authentication)
exports.createUser = async (req, res) => {
  try {
    const clerkId = req.user?.sub;
    if (!clerkId) {
      return res.status(400).json({ success: false, message: "Missing Clerk ID from token." });
    }

    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "duplicate_clerk_id",
        message: "Clerk ID นี้มีอยู่แล้ว"
      });
    }

    const user = new User({
      ...req.body,
      clerkId
    });
    const result = await user.save();

    try {
      const updatedUser = await clerkClient.users.updateUser(clerkId, {
        publicMetadata: {
          role: req.body.role || "admin"
        }
      });
      console.log("✅ Clerk updated:", updatedUser.id);
    } catch (err) {
      console.error("❌ Clerk update failed:", err.message);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "duplicate_key",
        message: "มีข้อมูลผู้ใช้นี้ในระบบแล้ว"
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
};

// Get user by authenticated Clerk ID (requires authentication)
exports.getUserByClerkId = async (req, res) => {
  try {
    const clerkId = req.user?.sub;
    if (!clerkId) {
      return res.status(400).json({ success: false, message: "Missing Clerk ID from token." });
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
};
