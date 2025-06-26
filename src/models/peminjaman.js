const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const HP = require('./hp');

const Peminjaman = sequelize.define('Peminjaman', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  hpId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'disetujui', 'ditolak', 'selesai'),
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  tableName: 'peminjaman',
  timestamps: false,
});

Peminjaman.belongsTo(HP, { foreignKey: 'hpId', as: 'hp' });

module.exports = Peminjaman; 