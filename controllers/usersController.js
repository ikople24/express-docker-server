const User = require("../models/Users");

// Create a new user (no authentication required, prevents duplicate clerkId)
exports.createUser = async (req, res) => {
  try {
    const { name, position, department, role, clerkId, profileUrl, phone, assignedTask } = req.body;

    if (!clerkId) {
      return res.status(400).json({ success: false, message: "Missing Clerk ID" });
    }

    // Auto-create if clerkId is 'admin'
    if (clerkId === "admin") {
      const user = new User({ name, position, department, role, clerkId, profileUrl, phone, assignedTask });
      await user.save();
      return res.status(201).json({ success: true, message: "Admin user created", user });
    }

    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User with this Clerk ID already exists" });
    }

    const newUser = new User({ name, position, department, role, clerkId, profileUrl, phone, assignedTask });
    await newUser.save();
    res.status(201).json({ success: true, message: "User created", user: newUser });
  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
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
// Get all users with basic info
exports.getAllBasicUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id name position department profileUrl");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("GET ALL BASIC USERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};