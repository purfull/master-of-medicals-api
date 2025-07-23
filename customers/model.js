const { DataTypes } = require('sequelize');
const sequelize = require('../db'); 
const Cart = require('../cart/model');

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
  additionalInformation: {
    type: DataTypes.JSON
  },
  remarks: {
    type: DataTypes.TEXT,

  },
  type: {
    type: DataTypes.ENUM('hospital', 'pathology-lab', 'diagnostic-center', 'physiotherapist', 'rehabilitation', 'poly-clinic'),
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved','rejected'),
    defaultValue: "pending",
  },

},  
{
  tableName: 'Customers',
  timestamps: true,
  hooks: {
    afterCreate: async (customer, options) => {
      await Cart.create({
        customerId: customer.id
      });
    }
  }
});


