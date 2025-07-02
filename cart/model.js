const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Customer = require('../customers/model');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'Cart',
  timestamps: true,
});

module.exports = Cart;
