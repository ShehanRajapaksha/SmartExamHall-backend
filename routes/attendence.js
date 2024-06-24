const express = require('express');
const { getAttendence, getAttendenceForActiveExams } = require('../controllers/attendence');
const router =express.Router();


router.route('/').post(getAttendence)
router.route('/active',getAttendenceForActiveExams)

module.exports=router