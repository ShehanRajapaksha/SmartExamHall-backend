
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const asyncWrapper = require('../middleware/async');
const e = require('express');
const Admin = require('../models/Admin');



const generateToken = (admin) => {
    const payload = {
      userId: admin.userId
    };
  
    // Sign the token with a secret key and set an expiration time
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
    
    
  };

const createAdmin = asyncWrapper(async (req, res, next) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        const error = new Error('User ID and password are required');
        error.status = 400;
        return next(error);
    }

    if (userId.toString().length !== 8) {
        const error = new Error('User ID must be exactly 8 digits');
        error.status = 400;
        return next(error);
    }

    try {
        // Check if the user ID already exists
        const existingAdmin = await Admin.findOne({ where: { userId } });
        if (existingAdmin) {
            const error = new Error('User ID already exists');
            error.status = 400;
            return next(error);
        }

        // Create new admin with hashed password
        const newAdmin = await Admin.create({ userId, password });

        res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
    } catch (error) {
        next(error); // Passes error to the error handling middleware
    }
});

const loginAdmin = asyncWrapper(async (req, res, next) => {
    const { userId, password } = req.body;
  
    if (!userId || !password) {
      const error = new Error('User ID and password are required');
      error.status = 400;
      return next(error);
    }
  
    try {
      // Find the admin with the given userId
      const admin = await Admin.findOne({ where: { userId } });
  
      if (!admin) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        return next(error);
      }
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, admin.password);
  
      if (!isPasswordValid) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        return next(error);
      }
  
      // Generate a JWT token
      let token;
      try {
        token = generateToken(admin);
      } catch (error) {
        const err = new Error('Failed to generate token');
        err.status = 500;
        return next(err);
      }
  
      res.status(200).json({ token,userId });
    } catch (error) {
      next(error); // Passes error to the error handling middleware
    }
  });
  
module.exports = {
    createAdmin,
    loginAdmin
};