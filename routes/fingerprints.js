const express = require('express');
const { verifyStudent, createFingerprint,setWss, setMode, manualAttendance } = require('../controllers/fingerprints');
const router =express.Router();

router.route('/').post(createFingerprint)
router.route('/verify').post(verifyStudent)
router.route('/mode').post(setMode)
router.route('/manual').post(manualAttendance)




module.exports.setWss = setWss;

module.exports = router