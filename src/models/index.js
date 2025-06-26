const { Sequelize } = require('sequelize');

// Ganti konfigurasi sesuai kebutuhanmu
const sequelize = new Sequelize('techrent_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize; 