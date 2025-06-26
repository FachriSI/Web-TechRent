const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const HP = sequelize.define('HP', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('tersedia', 'dipinjam'),
    allowNull: false,
    defaultValue: 'tersedia',
  },
}, {
  tableName: 'hp',
  timestamps: false,
});

module.exports = HP; 