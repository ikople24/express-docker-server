const express = require("express");
const ProblemOption = require("../models/ProblemOption");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const problems = await ProblemOption.find({ active: true });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

router.post("/", async (req, res) => {
  try {
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
  try {
    const updatedProblem = await ProblemOption.findByIdAndUpdate(
      req.params.id,
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
    await ProblemOption.findByIdAndDelete(req.params.id);
    res.json({ message: "Problem option deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete problem option" });
  }
});

module.exports = router;