const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect'); // Assuming you have a file for database connection setup

const Student = sequelize.define('Student', {
  stu_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Student ID is required'
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Name is required'
      }
    }
  },
  batch: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Batch is required'
      },
      isInt: {
        msg: 'Batch must be an integer'
      },
      min: {
        args: [0],
        msg: 'Invalid input-min'
      },
      max: {
        args: [99],
        msg: 'Invalid input-max'
      }
    }
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Degree is required'
      },
      isIn: {
        args: [['IT', 'ITM', 'AI']], // Array of valid values
        msg: 'Degree must be one of: IT, ITM, AI'
      }
    }
  },
  fingerprint: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Fingerprint is required'
      }
    }
  },
});

module.exports = Student;

