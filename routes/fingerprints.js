const express = require('express');
const { verifyStudent, createFingerprint,setWss, setMode, } = require('../controllers/fingerprints');
const router =express.Router();

router.route('/').post(createFingerprint)
router.route('/verify').post(verifyStudent)
router.route('/mode').post(setMode)



module.exports.setWss = setWss;

module.exports = router