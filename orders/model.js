const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Orders = sequelize.define(
  "Orders",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    }
  },
  {
    tableName: "Orders",
    timestamps: true,
  }
);

module.exports = Orders;
