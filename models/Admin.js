const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect');
const bcrypt = require('bcrypt')


const Admin = sequelize.define('Admin', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      validate: {
        len: [8, 8] // Ensure the userId is exactly 8 digits
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    hooks: {
      beforeCreate: async (admin) => {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
      },
      beforeUpdate: async (admin) => {
        if (admin.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          admin.password = await bcrypt.hash(admin.password, salt);
        }
      }
    }
  });
  
  
  module.exports = Admin;