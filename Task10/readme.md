# 💰 FinTrack — Personal Finance Dashboard

A full-stack Personal Finance Dashboard that allows users to track expenses, manage budgets, and visualize spending habits. Built with React on the frontend and Node.js with Express on the backend, connected to Microsoft SQL Server.

## 📌 Description

FinTrack is designed to simulate how a real-world personal finance tracker works. It provides a clean and responsive dashboard where users can add and manage transactions, set monthly budgets per category, view spending trends through charts, and get alerts when approaching budget limits. All data is saved in a SQL Server database so it persists even after restarting the server.

## ✨ Features

- 📊 Dashboard with live statistics and spending overview
- 💳 Add, edit, delete and search transactions
- 🗂️ Categorize expenses (Food, Transport, Entertainment, Shopping, Health, Utilities, Housing, Other)
- 📈 Monthly spending trends with area charts
- 🍩 Category breakdown with donut pie charts
- 📉 Budget vs actual spending bar chart comparison
- 🎯 Set monthly budgets per category
- ⚠️ Visual alerts when approaching or exceeding budget limits
- 📊 Progress bars showing budget utilization
- 🌙 Dark and Light mode toggle
- 🔔 Toast notifications for every action
- ↩️ Undo and Redo functionality
- 🔍 Real-time search with debouncing
- 📥 Export transactions as CSV
- 🔐 JWT Authentication (Register and Login)
- 📱 Fully responsive mobile-friendly layout

## 🛠️ Technologies Used

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 |
| Routing | React Router DOM |
| Charts | Recharts |
| HTTP Client | Axios |
| Backend | Node.js |
| Server Framework | Express.js |
| ORM | Sequelize |
| Database | Microsoft SQL Server |
| Authentication | JSON Web Token (JWT) |
| Password Hashing | bcryptjs |
## ⚙️ Setup & Installation

### Prerequisites

Make sure you have the following installed:

- Node.js 18+ — download from 👉 https://nodejs.org (LTS version)
- SQL Server Developer Edition — download from 👉 https://microsoft.com/sql-server
- SQL Server Management Studio (SSMS) — download from 👉 https://aka.ms/ssmsfullsetup

### Step 1 — Clone the Repository
```
git clone https://github.com/AbdulHaseeb43/codematics-Intership.git
cd codematics-Intership/Task10/fintrack
```

### Step 2 — Setup the Database

1. Open SSMS and connect to your SQL Server instance
2. Click **New Query**
3. Open and run the file `database/setup.sql`
4. You should see: `FinTrack database setup complete.`

### Step 3 — Configure Environment Variables
```
cp .env.example .env
```

Open `.env` and fill in your SQL Server details:
```
PORT=5000
DB_SERVER=YOUR_SQL_SERVER_NAME
DB_PORT=1433
DB_NAME=FinTrack
DB_USER=YOUR_SQL_USERNAME
DB_PASSWORD=YOUR_SQL_PASSWORD
JWT_SECRET=pick_any_long_random_string
NODE_ENV=development
```

### Step 4 — Install Dependencies
```
npm install
cd client && npm install && cd ..
```

### Step 5 — Run the App
```
npm run dev
```

You should see:
```
SQL Server connected
Server running on port 5000
Compiled successfully!
```

### Step 6 — Open in Browser

Go to:
```
http://localhost:3000
```

Register a new account and your Finance Dashboard is ready! ✅

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new account |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Add new transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/summary/monthly` | Monthly spending summary |
| GET | `/api/budgets` | Get budgets for month |
| POST | `/api/budgets` | Create or update budget |
| DELETE | `/api/budgets/:id` | Delete budget |

## 👨‍💻 Author

Abdul Haseeb
