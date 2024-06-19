const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');


const Fingerprint = sequelize.define('Fingerprint',{
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    validate: {
      min:0,
      notNull: {
        msg: 'Fingerprint is required'
      }
    }
  },
})


module.exports = Fingerprint