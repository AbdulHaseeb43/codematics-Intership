# FinTrack — Personal Finance Dashboard (SQL Server Edition)

A full-stack application built with React, Node.js, Express, Sequelize, and Microsoft SQL Server.

## Tech Stack

- **Microsoft SQL Server** — relational database
- **Sequelize** — ORM that talks to SQL Server via the tedious driver
- **Express** — REST API server
- **React** — frontend with hooks, context, and Recharts
- **Node.js** — server runtime

## Project Structure

```
fintrack/
├── database/
│   └── setup.sql                        # Run this in SSMS first
├── server/
│   ├── index.js                         # Express entry, DB sync
│   ├── config/
│   │   └── database.js                  # Sequelize + SQL Server config
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   └── Budget.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── budgetController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   └── budgets.js
│   └── middleware/
│       └── auth.js
└── client/
    └── src/
        ├── App.js
        ├── index.js
        ├── context/
        │   ├── AuthContext.js
        │   └── ThemeContext.js
        ├── hooks/
        │   ├── useTransactions.js
        │   ├── useBudgets.js
        │   ├── useDebounce.js
        │   └── useUndoRedo.js
        ├── pages/
        │   ├── Dashboard.js
        │   ├── Transactions.js
        │   ├── Budgets.js
        │   ├── Login.js
        │   └── Register.js
        ├── components/
        │   ├── Navbar.js
        │   ├── TransactionModal.js
        │   ├── ProgressBar.js
        │   ├── StatCard.js
        │   └── Toast.js
        ├── utils/
        │   ├── api.js
        │   ├── categories.js
        │   └── helpers.js
        └── styles/
            └── main.css
```

## Step 1 — Install SQL Server

Download **SQL Server Developer Edition** (free) from:
https://www.microsoft.com/en-us/sql-server/sql-server-downloads

Then download **SQL Server Management Studio (SSMS)** from:
https://aka.ms/ssmsfullsetup

## Step 2 — Create the Database in SSMS

1. Open SSMS and connect to your local SQL Server instance
2. Click **New Query** in the toolbar
3. Open the file `database/setup.sql` from this project
4. Paste the contents into the query window
5. Click **Execute** (or press F5)
6. You should see: `FinTrack database setup complete.`

## Step 3 — Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set your SQL Server credentials:

```
PORT=5000
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=FinTrack
DB_USER=sa
DB_PASSWORD=your_actual_password
JWT_SECRET=pick_any_long_random_string
NODE_ENV=development
```

If you are using Windows Authentication instead of SQL login, update `server/config/database.js` to use `trusted_connection: true` in the dialectOptions.

## Step 4 — Install Dependencies

Install server dependencies from the root folder:

```bash
npm install
```

Install client dependencies:

```bash
cd client && npm install && cd ..
```

## Step 5 — Run the App

```bash
npm run dev
```

This starts both servers at once using concurrently:
- Express API runs on http://localhost:5000
- React app runs on http://localhost:3000

Open your browser at **http://localhost:3000** and register a new account.

## API Endpoints

All transaction and budget routes require the header:
`Authorization: Bearer <token>`

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login and get token |
| GET | /api/auth/me | Get current user |

### Transactions

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/transactions | List transactions |
| POST | /api/transactions | Create transaction |
| PUT | /api/transactions/:id | Update transaction |
| DELETE | /api/transactions/:id | Delete transaction |
| GET | /api/transactions/summary/monthly | Monthly totals |

Query params for GET: `category`, `from`, `to`, `search`

### Budgets

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/budgets | Get budgets for month/year |
| POST | /api/budgets | Create or update a budget |
| DELETE | /api/budgets/:id | Delete a budget |

## SQL Server Tables

The app creates three tables automatically when the server starts via `sequelize.sync()`. You can also view and query them directly in SSMS:

```sql
USE FinTrack

SELECT * FROM Users
SELECT * FROM Transactions ORDER BY date DESC
SELECT * FROM Budgets
```

## Software You Need

| Software | Download |
|----------|----------|
| Node.js 18+ | https://nodejs.org |
| SQL Server Developer | https://microsoft.com/sql-server |
| SSMS | https://aka.ms/ssmsfullsetup |
| VS Code (optional) | https://code.visualstudio.com |
