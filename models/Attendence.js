const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');

const Attendence = sequelize.define('Attendence', {
  exam_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Exams', // name of the target model
      key: 'exam_id'  // key in the target model
    },
    allowNull: false
  },
  student_id: {
    type: DataTypes.STRING,
    references: {
      model: 'Students', // name of the target model
      key: 'stu_id'      // key in the target model
    },
    allowNull: false
  }
}, {
  timestamps: false // If you don't need timestamps
});

module.exports = Attendence;