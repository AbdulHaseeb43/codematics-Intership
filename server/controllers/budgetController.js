const Budget = require("../models/Budget")

const getBudgets = async (req, res) => {
  try {
    const now = new Date()
    const month = Number(req.query.month) || now.getMonth() + 1
    const year = Number(req.query.year) || now.getFullYear()

    const budgets = await Budget.findAll({
      where: { userId: req.user.id, month, year }
    })

    res.json(budgets)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const upsertBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body

    const existing = await Budget.findOne({
      where: { userId: req.user.id, category, month, year }
    })

    if (existing) {
      await existing.update({ amount })
      return res.json(existing)
    }

    const budget = await Budget.create({
      userId: req.user.id,
      category,
      amount,
      month,
      year
    })

    res.status(201).json(budget)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteBudget = async (req, res) => {
  try {
    await Budget.destroy({
      where: { id: req.params.id, userId: req.user.id }
    })

    res.json({ message: "Budget removed" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getBudgets, upsertBudget, deleteBudget }
