export const CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Education", "Health", "Entertainment", "Other"];
export const money = value => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(value || 0));
export const currentMonth = () => new Date().toISOString().slice(0, 7);
