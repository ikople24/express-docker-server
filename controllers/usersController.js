const getDbConnection = require('../utils/dbManager');
const userSchema = require('../models/Users');

// Create a new user (no authentication required, prevents duplicate clerkId)
exports.createUser = async (req, res) => {
  try {
    const appId = req.headers['x-app-id'];
    if (!appId) return res.status(400).json({ success: false, message: "Missing app-id" });

    const conn = await getDbConnection(appId);
    const User = conn.model('User', userSchema);

    const { name, position, department, role, clerkId, profileUrl, phone, assignedTask } = req.body;

    if (!clerkId) {
      return res.status(400).json({ success: false, message: "Missing Clerk ID" });
    }

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

// Update user (requires authentication)
exports.updateUser = async (req, res) => {
  try {
    const appId = req.headers['x-app-id'];
    if (!appId) return res.status(400).json({ success: false, message: "Missing app-id" });

    const conn = await getDbConnection(appId);
    const User = conn.model('User', userSchema);

    const { name, position, department, role, clerkId, profileUrl, phone, assignedTask } = req.body;

    if (!clerkId) {
      return res.status(400).json({ success: false, message: "Missing Clerk ID" });
    }

    // Debug: ดูข้อมูลที่ส่งมา
    console.log("🔍 BACKEND UPDATE - Received data:", {
      clerkId,
      assignedTask,
      assignedTaskType: typeof assignedTask,
      assignedTaskLength: assignedTask?.length,
      assignedTaskSplit: typeof assignedTask === 'string' ? assignedTask?.split(", ") : assignedTask
    });

    // ดูข้อมูลเดิมใน database ก่อน update
    const existingUser = await User.findOne({ clerkId });
    console.log("🔍 BACKEND UPDATE - Existing user data:", {
      clerkId: existingUser?.clerkId,
      existingAssignedTask: existingUser?.assignedTask,
      existingAssignedTaskType: typeof existingUser?.assignedTask,
      existingAssignedTaskSplit: typeof existingUser?.assignedTask === 'string' ? existingUser?.assignedTask?.split(", ") : existingUser?.assignedTask
    });

    // ใช้ findOneAndUpdate เพื่อแทนที่ค่าใหม่ทั้งหมด
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { 
        name, 
        position, 
        department, 
        role, 
        profileUrl, 
        phone, 
        assignedTask  // แทนที่ค่าใหม่ (ไม่ใช่ append)
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Debug: ดูผลลัพธ์หลัง update
    console.log("✅ BACKEND UPDATE - Updated user:", {
      clerkId: updatedUser.clerkId,
      assignedTask: updatedUser.assignedTask,
      assignedTaskType: typeof updatedUser.assignedTask,
      assignedTaskSplit: typeof updatedUser.assignedTask === 'string' ? updatedUser.assignedTask?.split(", ") : updatedUser.assignedTask,
      action: "replaced"
    });

    res.status(200).json({ success: true, message: "User updated", user: updatedUser });
  } catch (error) {
    console.error("❌ BACKEND UPDATE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user by authenticated Clerk ID (requires authentication)
exports.getUserByClerkId = async (req, res) => {
  try {
    const appId = req.headers['x-app-id'];
    if (!appId) return res.status(400).json({ success: false, message: "Missing app-id" });

    const conn = await getDbConnection(appId);
    const User = conn.model('User', userSchema);

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
    const appId = req.headers['x-app-id'];
    if (!appId) return res.status(400).json({ success: false, message: "Missing app-id" });

    const conn = await getDbConnection(appId);
    const User = conn.model('User', userSchema);

    const users = await User.find({}, "_id name position department profileUrl");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("GET ALL BASIC USERS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}; 