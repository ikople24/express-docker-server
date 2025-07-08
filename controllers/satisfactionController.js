const mongoose = require("mongoose");
// controllers/satisfactionController.js
const getDbConnection = require("../utils/dbManager");
const satisfactionSchema = require("../models/Satisfaction");

exports.createSatisfaction = async (req, res) => {
  try {
    const { complaintId, rating, comment } = req.body;

    if (!complaintId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const conn = await getDbConnection(req.appId);
    const Satisfaction = conn.model("Satisfaction", satisfactionSchema);

    const satisfaction = new Satisfaction({ complaintId, rating, comment });
    await satisfaction.save();

    res.status(201).json({ message: "Satisfaction submitted", satisfaction });
  } catch (err) {
    console.error("Error saving satisfaction:", err);
    res.status(500).json({ error: "Failed to submit satisfaction" });
  }
};

exports.getSatisfactions = async (req, res) => {
  try {
    const conn = await getDbConnection(req.appId);
    const Satisfaction = conn.model("Satisfaction", satisfactionSchema);

    const satisfactions = await Satisfaction.find().sort({ createdAt: -1 });
    res.json(satisfactions);
  } catch (err) {
    console.error("Error fetching satisfactions:", err);
    res.status(500).json({ error: "Failed to fetch satisfactions" });
  }
};

exports.getSatisfactionByComplaintId = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const conn = await getDbConnection(req.appId);
    const Satisfaction = conn.model("Satisfaction", satisfactionSchema);

    const objectId = mongoose.Types.ObjectId.isValid(complaintId)
      ? new mongoose.Types.ObjectId(complaintId)
      : complaintId;

    const data = await Satisfaction.find({ complaintId: objectId })
      .sort({ createdAt: -1 })
      .limit(4);

    res.json(data);
  } catch (err) {
    console.error("Error fetching satisfaction by complaintId:", err);
    res.status(500).json({ error: "Failed to fetch satisfaction data" });
  }
};