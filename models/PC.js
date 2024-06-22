const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect'); // Assuming you have a file for database connection setup

const PC = sequelize.define('PC', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
    },
    assigned:{
        type:DataTypes.BOOLEAN,
        allowNull:true,
    }
});

module.exports = PC;