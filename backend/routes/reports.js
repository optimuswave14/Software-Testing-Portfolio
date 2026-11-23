const express = require("express");
const { readData } = require("../utils/storage");
const router = express.Router();

router.get("/monthly", (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const transactions = readData("expenses.json").filter(x => String(x.date).startsWith(month));
  const income = transactions.filter(x => x.type === "income").reduce((s, x) => s + x.amount, 0);
  const expenses = transactions.filter(x => x.type !== "income").reduce((s, x) => s + x.amount, 0);
  const byCategory = {};
  transactions.filter(x => x.type !== "income").forEach(x => byCategory[x.category] = (byCategory[x.category] || 0) + x.amount);
  res.json({ month, income, expenses, balance: income - expenses, byCategory, transactions });
});
module.exports = router;
