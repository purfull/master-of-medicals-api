const { DataTypes } = require('sequelize');
const sequelize = require('../db');

module.exports = sequelize.define('banner', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bannerImage: {
    type: DataTypes.JSON
  },
  title: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT
  },
  ctaText: {
    type: DataTypes.TEXT,
  },
  ctaLink: {
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status:  {
    type: DataTypes.ENUM("active", "in-active"),
    defaultValue: "active",
  }

}, {
  tableName: 'banner',
  timestamps: true,
});


