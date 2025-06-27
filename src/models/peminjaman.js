const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const HP = require('./hp');
const User = require('./user');

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
  tanggal_kembali: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'disetujui', 'ditolak', 'selesai', 'dikembalikan', 'terlambat'),
    allowNull: false,
    defaultValue: 'pending',
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'peminjaman',
  timestamps: false,
});

Peminjaman.belongsTo(HP, { foreignKey: 'hpId', as: 'hp' });
Peminjaman.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Peminjaman; 