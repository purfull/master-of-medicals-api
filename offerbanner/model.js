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
  status:  {
    type: DataTypes.ENUM("active", "in-active"),
    defaultValue: "active",
  }

}, {
  tableName: 'offerBanner',
  timestamps: true,
});


