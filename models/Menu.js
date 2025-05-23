const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    Prob_name: String,
    Prob_pic: String,
    order: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "menu_list" }
);

module.exports = mongoose.model("Menu", menuSchema);
