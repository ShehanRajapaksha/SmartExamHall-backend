const express = require('express');
const { getAttendence, getAttendenceForActiveExams, getAttendenceByExamId } = require('../controllers/attendence');
const router =express.Router();


router.route('/').post(getAttendence)
router.route('/active',getAttendenceForActiveExams)
router.route('/getcurrent').post(getAttendenceByExamId)

module.exports=router