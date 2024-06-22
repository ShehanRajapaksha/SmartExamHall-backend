const express = require('express');
const { getAttendence } = require('../controllers/attendence');
const router =express.Router();


router.route('/').post(getAttendence)

module.exports=router