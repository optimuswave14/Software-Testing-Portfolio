# Finance Tracker

A beginner-friendly full-stack application for recording income and expenses, setting monthly category budgets, and viewing monthly reports.

## Features
- Add, edit and delete income/expense transactions
- Categorize transactions
- Dashboard with income, expenses and balance
- Set/update/delete monthly budgets by category
- Monthly report with category-wise expense totals
- Local JSON-file storage (no database setup required)

## Technology
- Frontend: React
- Backend: Node.js, Express
- Storage: JSON files on the backend

## Requirements
Install Node.js (LTS) and npm. Check using `node -v` and `npm -v`.

## Setup
Open two terminals in the project folder.

### Terminal 1 — backend
```bash
cd backend
npm install
npm start
```
Backend runs at http://localhost:5000. Check http://localhost:5000/api/health.

### Terminal 2 — frontend
```bash
cd frontend
npm install
npm start
```
The React app opens at http://localhost:3000.

## Notes
- Data is stored in `backend/data/expenses.json` and `backend/data/budgets.json`; these files are created automatically.
- Keep the backend terminal running while using the frontend.
- This is a local academic/demo application, not a production financial service. It does not include user accounts or bank integration.
