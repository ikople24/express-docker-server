const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");

// POST: เพิ่มเมนูใหม่จาก frontend
router.post("/", async (req, res) => {
  try {
    const { Prob_name, Prob_pic } = req.body;
    if (!Prob_name || !Prob_pic) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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
    const menus = await Menu.find({});
    console.log("✅ จำนวน:", menus.length);
    if (menus.length > 0) console.log("📦 ตัวอย่าง:", menus[0]);
    res.json(menus);
  } catch (err) {
    console.error("❌ Error fetching menus:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
