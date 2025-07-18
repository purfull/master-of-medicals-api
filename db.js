// const path = require('path');
const { Sequelize } = require('sequelize');
console.log(".........................",process.env.AUTH_DB_NAME, process.env.AUTH_DB_PASSWORD,"....."); 

module.exports = new Sequelize(process.env.AUTH_DB_NAME, process.env.AUTH_DB_USER, process.env.AUTH_DB_PASSWORD, {
  host: process.env.AUTH_DB_HOST,
  dialect: 'mysql'  
});
