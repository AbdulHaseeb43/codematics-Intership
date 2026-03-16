const jwt = require("jsonwebtoken")
const User = require("../models/User")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existing = await User.findOne({ where: { email } })
    if (existing) {
      return res.status(400).json({ message: "Email already in use" })
    }

    const user = await User.create({ name, email, password })

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMe = async (req, res) => {
  res.json(req.user)
}

module.exports = { register, login, getMe }
