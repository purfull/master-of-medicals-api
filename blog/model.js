const { DataTypes } = require('sequelize');
const sequelize = require('../db');

module.exports = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  featuredImage: {
    type: DataTypes.JSON
  },
  bannerImage: {
    type: DataTypes.JSON
  },
  author: {
    type: DataTypes.STRING
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  metaTitle: {
    type: DataTypes.TEXT,
  },
  metaDescription: {
    type: DataTypes.TEXT,
  },
  content: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  isActive:  {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }

}, {
  tableName: 'Blog',
  timestamps: true,
});


