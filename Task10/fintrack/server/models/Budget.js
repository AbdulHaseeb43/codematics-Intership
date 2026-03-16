const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const User = require("./User")

const Budget = sequelize.define("Budget", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

Budget.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" })
User.hasMany(Budget, { foreignKey: "userId" })

module.exports = Budget
