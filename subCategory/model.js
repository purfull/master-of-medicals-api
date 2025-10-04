const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const SubCategory = sequelize.define('SubCategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Category',
      key: 'id'
    }
  }
}, {
  tableName: 'SubCategory',
  timestamps: false
});

module.exports = SubCategory;
