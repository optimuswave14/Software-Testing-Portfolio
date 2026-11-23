import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";

export default function App() {
  const [page, setPage] = useState("Dashboard");
  const pages = { Dashboard, Expenses, Budgets, Reports };
  const Page = pages[page];
  return <div className="app-shell">
    <header><div><h1>₹ Finance Tracker</h1><p>Manage your money, one step at a time.</p></div></header>
    <nav>{Object.keys(pages).map(name => <button key={name} className={page === name ? "active" : ""} onClick={() => setPage(name)}>{name}</button>)}</nav>
    <main><Page /></main>
    <footer>Finance Tracker · Student software testing project</footer>
  </div>;
}
