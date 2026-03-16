const { Sequelize } = require("sequelize")

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT) || 1433,
    dialect: "mssql",
    logging: false,
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true
      }
    }
  }
)

module.exports = sequelize