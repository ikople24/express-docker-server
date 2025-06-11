const express = require("express");
const getDbConnection = require("../utils/dbManager");
const problemOptionSchema = require("../models/ProblemOption");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const conn = await getDbConnection(req.headers['x-app-id']);
    const ProblemOption = conn.model('ProblemOption', problemOptionSchema);
    const problems = await ProblemOption.find({ active: true });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

router.post("/", async (req, res) => {
  try {
    const conn = await getDbConnection(req.headers['x-app-id']);
    const ProblemOption = conn.model('ProblemOption', problemOptionSchema);
    const { label, iconUrl, category, active } = req.body;
    const newProblem = new ProblemOption({
      label,
      iconUrl,
      category,
      active: active ?? true
    });

    await newProblem.save();
    res.status(201).json({ message: "Problem option created", data: newProblem });
  } catch (err) {
    console.error("❌ Error creating problem option:", err);
    res.status(500).json({ error: "Failed to create problem option" });
  }
});

router.put("/:id", async (req, res) => {
  console.log("🛠 Updating ProblemOption with ID:", req.params.id);
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const conn = await getDbConnection(req.headers['x-app-id']);
    const ProblemOption = conn.model('ProblemOption', problemOptionSchema);

    const updatedProblem = await ProblemOption.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json({ message: "Problem option updated", data: updatedProblem });
  } catch (err) {
    res.status(500).json({ error: "Failed to update problem option" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const conn = await getDbConnection(req.headers['x-app-id']);
    const ProblemOption = conn.model('ProblemOption', problemOptionSchema);
    await ProblemOption.findByIdAndDelete(req.params.id);
    res.json({ message: "Problem option deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete problem option" });
  }
});

module.exports = router;