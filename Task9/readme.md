# 📚 LibraryOS — Library Management System

A full-stack **Library Management System** that allows admins to manage books, members, and issue/return records efficiently. Built with modern web technologies including React, Vite, Tailwind CSS on the frontend and Node.js with Express on the backend.

## 📌 Description

LibraryOS is designed to simulate how a real-world library management software works. It provides a clean and responsive dashboard where admins can add and manage books, register members, issue books to members, track returns, and calculate fines for late returns. All data is saved in JSON files so it persists even after restarting the server.

---

## ✨ Features

- 📊 Dashboard with live statistics
- 📚 Add, edit, delete and search books
- 👥 Register, edit and delete members
- 🔄 Issue books and return them with fine calculation
- 🔍 Real-time search for books and members
- 🌙 Dark and Light mode toggle
- 🔔 Toast notifications for every action
- ✅ Form validation and confirm before delete
- 💾 Data saved in JSON files

---

## 🛠️ Technologies Used

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18 |
| Build Tool | Vite 4 |
| Styling | Tailwind CSS 3 |
| HTTP Client | Axios |
| Backend | Node.js |
| Server Framework | Express.js |
| Data Storage | JSON File System |

---

## 📁 Project Structure

```
Task9/
├── backend/
│   ├── server.js        ← Express REST API
│   ├── package.json
│   └── data/            ← Auto created on first run
│       ├── books.json
│       ├── members.json
│       └── issues.json
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api.js
        ├── index.css
        ├── components/
        │   ├── Sidebar.jsx
        │   └── UI.jsx
        ├── context/
        │   └── ToastContext.jsx
        └── pages/
            ├── Dashboard.jsx
            ├── Books.jsx
            ├── Members.jsx
            ├── IssueReturn.jsx
            └── Search.jsx
```

---

## ⚙️ Setup & Installation

### Prerequisites

Make sure you have **Node.js** installed on your computer.
Download it from 👉 [https://nodejs.org](https://nodejs.org) (LTS version)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/AbdulHaseeb43/codematics-Intership.git
cd codematics-Intership/Task9
```

---

### Step 2 — Setup Backend

Open a terminal and run:

```bash
cd backend
npm install
node server.js
```

You should see:
```
Library API running on http://localhost:5000
```

---

### Step 3 — Setup Frontend

Open a **second terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
➜  Local:   http://localhost:3000/
```

---

### Step 4 — Open in Browser

Go to:
```
http://localhost:3000
```

Your Library Management System is now running! ✅

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| POST | `/api/books` | Add new book |
| PUT | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |
| GET | `/api/members` | Get all members |
| POST | `/api/members` | Add new member |
| PUT | `/api/members/:id` | Update member |
| DELETE | `/api/members/:id` | Delete member |
| GET | `/api/issues` | Get all issues |
| POST | `/api/issues` | Issue a book |
| POST | `/api/issues/:id/return` | Return a book |
| GET | `/api/stats` | Get dashboard stats |


## 👨‍💻 Author

**Abdul Haseeb**
