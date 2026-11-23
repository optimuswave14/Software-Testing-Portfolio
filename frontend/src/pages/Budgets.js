import React, { useEffect, useState } from "react";
import { deleteBudget, getBudgets, getExpenses, saveBudget } from "../utils/api";
import { CATEGORIES, currentMonth, money } from "../utils/constants";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]), [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: "Food", limit: "", month: currentMonth() }), [error, setError] = useState("");
  const load = () => Promise.all([getBudgets(), getExpenses()]).then(([b, e]) => { setBudgets(b); setExpenses(e); }).catch(x => setError(x.message));
  useEffect(() => { load(); }, []);
  const submit = async e => { e.preventDefault(); try { await saveBudget(form); setForm({ ...form, limit: "" }); load(); } catch (x) { setError(x.message); } };
  const spent = (category, month) => expenses.filter(x => x.type !== "income" && x.category === category && x.date.startsWith(month)).reduce((s, x) => s + x.amount, 0);
  return <section><h2>Monthly Budgets</h2>
    <form className="panel form-grid" onSubmit={submit}>
      <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
      <label>Budget limit (₹)<input type="number" min="0.01" step="0.01" required value={form.limit} onChange={e => setForm({ ...form, limit: e.target.value })} /></label>
      <label>Month<input type="month" required value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} /></label>
      <div className="form-actions"><button className="primary">Save budget</button></div>
    </form>
    {error && <p className="error">{error}</p>}
    <div className="budget-list">{budgets.map(b => { const amount = spent(b.category, b.month), pct = Math.min(100, amount / b.limit * 100); return <article className="panel" key={b.id}>
      <div className="budget-heading"><strong>{b.category} · {b.month}</strong><button className="danger" onClick={async () => { await deleteBudget(b.id); load(); }}>Delete</button></div>
      <p>{money(amount)} spent of {money(b.limit)}</p><div className="progress"><span style={{ width: `${pct}%` }} /></div>
      <small>{amount > b.limit ? "Budget exceeded" : `${Math.round(pct)}% used`}</small>
    </article>; })}</div>
    {budgets.length === 0 && <p>No budgets set yet.</p>}
  </section>;
}
