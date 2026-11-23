import React, { useEffect, useState } from "react";
import { getMonthlyReport } from "../utils/api";
import { currentMonth, money } from "../utils/constants";

export default function Dashboard() {
  const [report, setReport] = useState(null), [error, setError] = useState("");
  useEffect(() => { getMonthlyReport(currentMonth()).then(setReport).catch(e => setError(e.message)); }, []);
  if (error) return <p className="error">{error}</p>;
  if (!report) return <p>Loading dashboard...</p>;
  return <section><h2>Dashboard</h2><p className="muted">Overview for {report.month}</p>
    <div className="stats">
      <article><span>Total Income</span><strong>{money(report.income)}</strong></article>
      <article><span>Total Expenses</span><strong>{money(report.expenses)}</strong></article>
      <article><span>Balance</span><strong>{money(report.balance)}</strong></article>
    </div>
    <h3>Recent transactions</h3>
    {report.transactions.length === 0 ? <p>No transactions yet. Add one from Expenses.</p> :
      <div className="table-wrap"><table><thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Type</th><th>Amount</th></tr></thead>
      <tbody>{report.transactions.slice().reverse().slice(0, 5).map(x => <tr key={x.id}><td>{x.date}</td><td>{x.title}</td><td>{x.category}</td><td>{x.type}</td><td>{money(x.amount)}</td></tr>)}</tbody></table></div>}
  </section>;
}
