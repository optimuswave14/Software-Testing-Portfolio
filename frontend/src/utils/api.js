const BASE = "/api";
async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}
export const getExpenses = () => request("/expenses");
export const addExpense = body => request("/expenses", { method: "POST", body: JSON.stringify(body) });
export const updateExpense = (id, body) => request(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteExpense = id => request(`/expenses/${id}`, { method: "DELETE" });
export const getBudgets = () => request("/budgets");
export const saveBudget = body => request("/budgets", { method: "POST", body: JSON.stringify(body) });
export const deleteBudget = id => request(`/budgets/${id}`, { method: "DELETE" });
export const getMonthlyReport = month => request(`/reports/monthly?month=${month}`);
