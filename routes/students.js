const express = require('express');
const router =express.Router();
const {getAllStudents,createStudent,getStudent,updateStudent,deleteStudent} = require("../controllers/students");
const authenticateToken = require('../middleware/authMiddleware');

router.route('/').get(authenticateToken,getAllStudents).post(authenticateToken,createStudent)
router.route('/:id').get(getStudent).patch(authenticateToken,updateStudent).delete(authenticateToken,deleteStudent)


module.exports = router