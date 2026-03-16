const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const User = require("./User")

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
})

Transaction.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" })
User.hasMany(Transaction, { foreignKey: "userId" })

module.exports = Transaction
