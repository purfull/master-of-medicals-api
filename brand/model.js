const { DataTypes } = require('sequelize');
const sequelize = require('../db');

module.exports = sequelize.define('brand', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  brandImage: {
    type: DataTypes.JSON
  },
  name: {
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isActive:  {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }

}, {
  tableName: 'brand',
  timestamps: true,
});


