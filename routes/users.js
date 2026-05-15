const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

// สอดคล้องกับ smart-takhli: admin / superadmin
const STAFF_ROLES = ["admin", "superadmin"];

// ผู้ล็อกอิน: ดึง user ใน DB ของตัวเอง (ใช้แทน all-basic สำหรับ check-registered)
router.get("/me", requireAuth, usersController.getUserForSession);

// Create a new user (สิทธิ์ staff — สอดคล้องกับ pages/api/users/create.js)
router.post("/create", requireAuth, requireRole(STAFF_ROLES), usersController.createUser);

// Update user (requires authentication + staff role)
router.put("/update", requireAuth, requireRole(STAFF_ROLES), usersController.updateUser);

// Get user by Clerk ID (needs authentication; ใช้ sub จาก token)
router.get("/get-by-clerkId", requireAuth, usersController.getUserByClerkId);

// Get all users with basic info (staff only — ต้องส่ง Authorization: Bearer <session> จาก Next)
router.get("/all-basic", requireAuth, requireRole(STAFF_ROLES), usersController.getAllBasicUsers);

module.exports = router;