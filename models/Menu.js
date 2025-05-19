const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    Prob_name: String,
    Prob_pic: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { collection: "menu_list" }
);

module.exports = mongoose.model("Menu", menuSchema);