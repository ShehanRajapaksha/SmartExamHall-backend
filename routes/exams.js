const express = require('express');
const router =express.Router();

const {createExam,getAllExam,updateExam,deleteExam,setActive,  getExamById} = require('../controllers/exams');
const authenticateToken = require('../middleware/authMiddleware');

router.route('/')
  .post(authenticateToken,createExam)
  .get(authenticateToken,getAllExam);

router.route('/:id')
  .patch(authenticateToken,updateExam)
  .delete(authenticateToken,deleteExam)
  .get(getExamById)

router.route('/setActive').post(authenticateToken,setActive)


module.exports =router