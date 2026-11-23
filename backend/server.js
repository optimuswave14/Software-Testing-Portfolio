const express = require("express");
const cors = require("cors");
const budgetsRouter = require("./routes/budgets");
const expensesRouter = require("./routes/expenses");
const reportsRouter = require("./routes/reports");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok", message: "Finance Tracker API is running" }));
app.use("/api/budgets", budgetsRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/reports", reportsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
