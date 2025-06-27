const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'website',
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'feedback',
  timestamps: true,
});

Feedback.belongsTo(require('./user'), { foreignKey: 'user_id', as: 'user' });

module.exports = Feedback; 