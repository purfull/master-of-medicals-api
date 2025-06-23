const { DataTypes } = require('sequelize');
const sequelize = require('../db');

module.exports = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  postedBy: {
    type: DataTypes.INTEGER,
  },
  thumbnailImage: {
    type: DataTypes.JSON
  },
  galleryImage: {
    type: DataTypes.JSON
  },
  price: {
    type: DataTypes.STRING
  },
  priceLable: {
    type: DataTypes.STRING
  },
  brandName: {
    type: DataTypes.TEXT,
  },
  benefits: {
    type: DataTypes.TEXT,
  },
  expiresOn: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  additionalInformation: {
    type: DataTypes.JSON
  },
  status:  {
    type: DataTypes.STRING,
  }

}, {
  tableName: 'Product',
  timestamps: true,
});


