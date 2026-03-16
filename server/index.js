const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const cors = require("cors")
const sequelize = require("./config/database")

require("./models/User")
require("./models/Transaction")
require("./models/Budget")

const authRoutes = require("./routes/auth")
const transactionRoutes = require("./routes/transactions")
const budgetRoutes = require("./routes/budgets")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/transactions", transactionRoutes)
app.use("/api/budgets", budgetRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong" })
})

sequelize.authenticate()
  .then(() => {
    console.log("SQL Server connected")
    return sequelize.sync()
  })
  .then(() => {
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(err => console.error("Database connection failed:", err))