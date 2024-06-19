const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');
const Student = require('./Student');
const PC = require('./PC');

const Allocation = sequelize.define('Allocation', {
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: 'id'
    }
  },
  pcId: {
    type: DataTypes.INTEGER,
    references: {
      model: PC,
      key: 'id'
    }
  }
});

Allocation.belongsTo(Student, { foreignKey: 'studentId' });
Allocation.belongsTo(PC, { foreignKey: 'pcId' });

module.exports = Allocation;
