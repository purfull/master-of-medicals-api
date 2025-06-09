const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 

module.exports = sequelize.define('Testimonial', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  designation: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.JSON
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

}, {
  tableName: 'Testimonial',
  timestamps: true,
});


