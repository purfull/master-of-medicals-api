const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Customer = require('../customers/model');

const Address = sequelize.define('Address', {
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
  address: {
    type: DataTypes.TEXT,
  },
  city: {
    type: DataTypes.TEXT,
  },
  state: {
    type: DataTypes.TEXT,
  },
  country: {
    type: DataTypes.TEXT,
  },
  postalCode: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'Address',
  timestamps: true,
});

module.exports = Address;
