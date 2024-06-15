const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect'); // Assuming you have a file for database connection setup

const PC = sequelize.define('PC', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
});

module.exports = PC;