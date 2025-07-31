const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

module.exports = sequelize.define('Vendors', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
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
  files: {
    type: DataTypes.JSON,
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('manufacturing', 'oem', 'dealer'),
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved','rejected'),
    defaultValue: "pending",
  },

}, {
  tableName: 'Vendors',
  timestamps: true,
});


