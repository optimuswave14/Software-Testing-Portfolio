import React, { useEffect, useState } from "react";
import { addExpense, deleteExpense, getExpenses, updateExpense } from "../utils/api";
import { CATEGORIES, money } from "../utils/constants";

const blank = { title: "", amount: "", category: "Food", date: new Date().toISOString().slice(0, 10), type: "expense", notes: "" };
export default function Expenses() {
  const [items, setItems] = useState([]), [form, setForm] = useState(blank), [editing, setEditing] = useState(null), [error, setError] = useState("");
  const load = () => getExpenses().then(setItems).catch(e => setError(e.message));
  useEffect(() => { load(); }, []);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setError("");
    try {
      if (editing) await updateExpense(editing, form); else await addExpense(form);
      setForm(blank); setEditing(null); load();
    } catch (err) { setError(err.message); }
  };
  const edit = item => { setEditing(item.id); setForm({ ...item, amount: String(item.amount) }); };
  const remove = async id => { if (window.confirm("Delete this transaction?")) { try { await deleteExpense(id); load(); } catch (e) { setError(e.message); } } };
  return <section><h2>Income & Expenses</h2>
    <form className="panel form-grid" onSubmit={submit}>
      <label>Title<input name="title" value={form.title} onChange={change} required /></label>
      <label>Amount (₹)<input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={change} required /></label>
      <label>Category<select name="category" value={form.category} onChange={change}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
      <label>Date<input name="date" type="date" value={form.date} onChange={change} required /></label>
      <label>Type<select name="type" value={form.type} onChange={change}><option value="expense">Expense</option><option value="income">Income</option></select></label>
      <label>Notes<input name="notes" value={form.notes} onChange={change} /></label>
      <div className="form-actions"><button className="primary">{editing ? "Update transaction" : "Add transaction"}</button>{editing && <button type="button" onClick={() => { setEditing(null); setForm(blank); }}>Cancel</button>}</div>
    </form>
    {error && <p className="error">{error}</p>}
    <h3>All transactions</h3>
    {items.length === 0 ? <p>No transactions added yet.</p> : <div className="table-wrap"><table><thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Type</th><th>Amount</th><th>Actions</th></tr></thead>
    <tbody>{items.slice().reverse().map(x => <tr key={x.id}><td>{x.date}</td><td>{x.title}</td><td>{x.category}</td><td>{x.type}</td><td>{money(x.amount)}</td><td><button onClick={() => edit(x)}>Edit</button> <button className="danger" onClick={() => remove(x.id)}>Delete</button></td></tr>)}</tbody></table></div>}
  </section>;
}
