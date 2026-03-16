const { Op, fn, col, literal } = require("sequelize")
const Transaction = require("../models/Transaction")

const getTransactions = async (req, res) => {
  try {
    const { category, from, to, search } = req.query

    const where = { userId: req.user.id }

    if (category && category !== "all") {
      where.category = category
    }

    if (from || to) {
      where.date = {}
      if (from) where.date[Op.gte] = from
      if (to) where.date[Op.lte] = to
    }

    if (search) {
      where.description = { [Op.like]: `%${search}%` }
    }

    const transactions = await Transaction.findAll({
      where,
      order: [["date", "DESC"], ["createdAt", "DESC"]]
    })

    res.json(transactions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createTransaction = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body

    const transaction = await Transaction.create({
      description,
      amount,
      category,
      date,
      userId: req.user.id
    })

    res.status(201).json(transaction)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, userId: req.user.id }
    })

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    await transaction.update(req.body)
    res.json(transaction)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, userId: req.user.id }
    })

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    await transaction.destroy()
    res.json({ message: "Deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMonthlySummary = async (req, res) => {
  try {
    const summary = await Transaction.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.gte]: literal("DATEADD(month, -5, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1))")
        }
      },
      attributes: [
        [fn("MONTH", col("date")), "month"],
        [fn("YEAR", col("date")), "year"],
        [fn("SUM", col("amount")), "total"]
      ],
      group: [fn("YEAR", col("date")), fn("MONTH", col("date"))],
      order: [
        [fn("YEAR", col("date")), "ASC"],
        [fn("MONTH", col("date")), "ASC"]
      ],
      raw: true
    })

    res.json(summary)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary
}
