const { DataTypes } = require("sequelize")
const bcrypt = require("bcryptjs")
const sequelize = require("../config/database")

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
})

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10)
})

User.prototype.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = User
