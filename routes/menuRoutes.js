const express = require("express");
const router = express.Router();
const getDbConnection = require("../utils/dbManager");

// POST: เพิ่มเมนูใหม่จาก frontend
router.post("/", async (req, res) => {
  try {
    const { Prob_name, Prob_pic } = req.body;
    if (!Prob_name || !Prob_pic) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const conn = await getDbConnection(req.appId);
    const Menu = conn.model("Menu", require("../models/Menu"));
    const newMenu = new Menu({ Prob_name, Prob_pic });
    const saved = await newMenu.save();
    console.log("✅ New menu saved:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error saving menu:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: ดึงเมนูทั้งหมด
router.get("/", async (req, res) => {
  try {
    const conn = await getDbConnection(req.appId);
    const Menu = conn.model("Menu", require("../models/Menu"));
    const menus = await Menu.find({});
    console.log("✅ จำนวน:", menus.length);
    if (menus.length > 0) console.log("📦 ตัวอย่าง:", menus[0]);
    res.json(menus);
  } catch (err) {
    console.error("❌ Error fetching menus:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// POST: อัปเดตลำดับของเมนู
router.post("/update-order", async (req, res) => {
  try {
    const updates = req.body; // คาดว่าเป็น array เช่น [{ _id: '...', order: 1 }, ...]
    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const conn = await getDbConnection(req.appId);
    const Menu = conn.model("Menu", require("../models/Menu"));
    for (const item of updates) {
      await Menu.findByIdAndUpdate(item._id, { order: item.order });
    }

    res.status(200).json({ message: "Menu order updated successfully" });
  } catch (err) {
    console.error("❌ Error updating menu order:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
