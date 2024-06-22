const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');


const Exam = sequelize.define('Exam', {
    exam_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    module: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    active:{
        type:DataTypes.BOOLEAN,
        allowNull:true
    }
},

);

module.exports=Exam