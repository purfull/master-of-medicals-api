const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

module.exports = sequelize.define('Customers', {
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
  type: {
    type: DataTypes.ENUM('hospital', 'pathology-lab', 'diagnostic-center', 'physiotherapist', 'rehabilitation', 'poly-clinic'),
  },
  status: {
    type: DataTypes.ENUM("active", "in-active"),
    defaultValue: "active",
  },

}, {
  tableName: 'Customers',
  timestamps: true,
});


