const express = require('express');
const router =express.Router();
const{getAllStudents,createStudent,getStudent,updateStudent,deleteStudent,verifyStudent} = require("../controllers/students")

router.route('/').get(getAllStudents).post(createStudent)
router.route('/:id').get(getStudent).patch(updateStudent).delete(deleteStudent)
router.route('/verify').post(verifyStudent)

module.exports = router