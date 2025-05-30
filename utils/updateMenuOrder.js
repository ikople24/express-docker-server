// updateMenuOrder.js
const mongoose = require("mongoose");
const Menu = require("../models/Menu");
require("dotenv").config();

const updateMenuOrder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const menus = await Menu.find().sort("createdAt");

    for (let i = 0; i < menus.length; i++) {
      menus[i].order = i + 1;
      await menus[i].save();
      console.log(`📌 Updated order for: ${menus[i].Prob_name} => ${i + 1}`);
    }

    console.log("✅ Order update completed");
    process.exit();
  } catch (error) {
    console.error("❌ Error updating menu order:", error);
    process.exit(1);
  }
};

updateMenuOrder();
