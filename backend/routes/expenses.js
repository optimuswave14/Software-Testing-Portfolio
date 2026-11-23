const express = require("express");
const { readData, writeData } = require("../utils/storage");
const router = express.Router();
const FILE = "expenses.json";
const categories = ["Food", "Transport", "Shopping", "Bills", "Education", "Health", "Entertainment", "Other"];

router.get("/", (req, res) => res.json(readData(FILE)));
router.post("/", (req, res) => {
  const { title, amount, category, date, type = "expense", notes = "" } = req.body;
  if (!title || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || !date) {
    return res.status(400).json({ message: "Title, a positive amount and date are required." });
  }
  const items = readData(FILE);
  const item = { id: Date.now().toString(), title: String(title).trim(), amount: Number(amount),
    category: category || "Other", date, type, notes };
  items.push(item); writeData(FILE, items); res.status(201).json(item);
});
router.put("/:id", (req, res) => {
  const items = readData(FILE), index = items.findIndex(x => x.id === req.params.id);
  if (index < 0) return res.status(404).json({ message: "Transaction not found." });
  const old = items[index], body = req.body;
  const amount = body.amount === undefined ? old.amount : Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: "Amount must be positive." });
  items[index] = { ...old, ...body, amount }; writeData(FILE, items); res.json(items[index]);
});
router.delete("/:id", (req, res) => {
  const items = readData(FILE), next = items.filter(x => x.id !== req.params.id);
  if (next.length === items.length) return res.status(404).json({ message: "Transaction not found." });
  writeData(FILE, next); res.json({ message: "Transaction deleted." });
});
module.exports = router;
