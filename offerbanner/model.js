const { DataTypes } = require('sequelize');
const sequelize = require('../db');

module.exports = sequelize.define('offerBanner', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bannerImage: {
    type: DataTypes.JSON
  },
  ctaText: {
    type: DataTypes.TEXT,
  },
  ctaLink: {
    type: DataTypes.TEXT,
  },
  isActive:  {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }

}, {
  tableName: 'offerBanner',
  timestamps: true,
});


