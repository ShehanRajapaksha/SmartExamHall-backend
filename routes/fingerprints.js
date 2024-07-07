const express = require('express');
const { verifyStudent, createFingerprint,setWss, setMode, manualAttendance, revokeAttendance } = require('../controllers/fingerprints');
const router =express.Router();

router.route('/').post(createFingerprint)
router.route('/verify').post(verifyStudent)
router.route('/mode').post(setMode)
router.route('/manual').post(manualAttendance)
router.route('/revoke').post(revokeAttendance)




module.exports.setWss = setWss;

module.exports = router