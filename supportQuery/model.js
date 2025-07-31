const { DataTypes } = require('sequelize');
const sequelize = require('../db');

module.exports = sequelize.define('SupportQuery', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
  },
  phone: {
    type: DataTypes.TEXT,
  },
  subject: {
    type: DataTypes.TEXT,
  },
  message: {
    type: DataTypes.TEXT,
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.TEXT,
  },

}, {
  tableName: 'SupportQuery',
  timestamps: true,
});


