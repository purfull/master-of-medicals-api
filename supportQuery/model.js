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
  message: {
    type: DataTypes.TEXT,
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

}, {
  tableName: 'SupportQuery',
  timestamps: true,
});


