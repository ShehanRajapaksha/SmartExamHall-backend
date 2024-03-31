require('dotenv').config()
// const mysql = require('mysql2')

// // console.log(process.env.DB_HOST,process.env.USER);

// const pool = mysql.createPool({
//     host:process.env.DB_HOST,
//     user:process.env.DB_USER,
//     database:process.env.DB_NAME,
//     password:process.env.DB_PASSWORD,
// })



// module.exports = pool.promise();


const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql', // or 'postgres', 'sqlite', 'mssql', etc.
});

module.exports = sequelize;