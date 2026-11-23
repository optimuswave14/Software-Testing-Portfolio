const express = require("express");
const { readData, writeData } = require("../utils/storage");
const router = express.Router();
const FILE = "budgets.json";

router.get("/", (req, res) => res.json(readData(FILE)));
router.post("/", (req, res) => {
  const { category, limit, month } = req.body;
  if (!category || !Number.isFinite(Number(limit)) || Number(limit) <= 0 || !month)
    return res.status(400).json({ message: "Category, positive limit and month (YYYY-MM) are required." });
  const items = readData(FILE);
  const existing = items.findIndex(x => x.category === category && x.month === month);
  const budget = { id: existing >= 0 ? items[existing].id : Date.now().toString(), category, limit: Number(limit), month };
  if (existing >= 0) items[existing] = budget; else items.push(budget);
  writeData(FILE, items); res.status(existing >= 0 ? 200 : 201).json(budget);
});
router.delete("/:id", (req, res) => {
  const items = readData(FILE), next = items.filter(x => x.id !== req.params.id);
  if (items.length === next.length) return res.status(404).json({ message: "Budget not found." });
  writeData(FILE, next); res.json({ message: "Budget deleted." });
});
module.exports = router;
