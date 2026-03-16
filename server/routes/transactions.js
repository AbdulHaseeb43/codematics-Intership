const express = require("express")
const protect = require("../middleware/auth")
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary
} = require("../controllers/transactionController")

const router = express.Router()

router.use(protect)

router.get("/summary/monthly", getMonthlySummary)
router.get("/", getTransactions)
router.post("/", createTransaction)
router.put("/:id", updateTransaction)
router.delete("/:id", deleteTransaction)

module.exports = router
