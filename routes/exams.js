const express = require('express');
const router =express.Router();

const {createExam,getAllExam,updateExam,deleteExam,setActive} = require('../controllers/exams')

router.route('/')
  .post(createExam)
  .get(getAllExam);

router.route('/:id')
  .patch(updateExam)
  .delete(deleteExam);

router.route('/setActive').post(setActive)


module.exports =router