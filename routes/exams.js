const express = require('express');
const router =express.Router();

const {createExam,getAllExam,updateExam,deleteExam,setActive,  getExamById} = require('../controllers/exams')

router.route('/')
  .post(createExam)
  .get(getAllExam);

router.route('/:id')
  .patch(updateExam)
  .delete(deleteExam)
  .get(getExamById)

router.route('/setActive').post(setActive)


module.exports =router