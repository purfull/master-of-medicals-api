const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const VendorOrders = sequelize.define(
  "VendorOrders",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vendorId: {
      type: DataTypes.INTEGER,
    },
    customerOrderId: {
        type: DataTypes.INTEGER,
    },
    customerInfo: {
      type: DataTypes.JSON,
    },
    productInfo: {
      type: DataTypes.JSON,
    },
    subTotal: {
      type: DataTypes.INTEGER,
    },
    gstAmount: {
      type: DataTypes.INTEGER,
    },
    totalCost: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending"
    }
  },
  {
    tableName: "VendorOrders",
    timestamps: true,
  }
);

module.exports = VendorOrders;
