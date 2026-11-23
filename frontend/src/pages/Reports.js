import React, { useEffect, useState } from "react";
import { getMonthlyReport } from "../utils/api";
import { currentMonth, money } from "../utils/constants";

export default function Reports() {
  const [month, setMonth] = useState(currentMonth()), [report, setReport] = useState(null), [error, setError] = useState("");
  useEffect(() => { getMonthlyReport(month).then(setReport).catch(e => setError(e.message)); }, [month]);
  return <section><h2>Monthly Report</h2><label className="month-picker">Select month <input type="month" value={month} onChange={e => setMonth(e.target.value)} /></label>
    {error && <p className="error">{error}</p>}
    {!report ? <p>Loading report...</p> : <>
      <div className="stats"><article><span>Income</span><strong>{money(report.income)}</strong></article><article><span>Expenses</span><strong>{money(report.expenses)}</strong></article><article><span>Net balance</span><strong>{money(report.balance)}</strong></article></div>
      <h3>Expenses by category</h3>
      {Object.keys(report.byCategory).length === 0 ? <p>No expenses recorded for this month.</p> : <div className="panel">{Object.entries(report.byCategory).map(([category, amount]) => <div className="category-row" key={category}><span>{category}</span><strong>{money(amount)}</strong></div>)}</div>}
    </>}
  </section>;
}
