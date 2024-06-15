const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');


const Fingerprint = sequelize.define('Fingerprint',{
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Student ID is required'
      }
    }
  },
})


module.exports = Fingerprint