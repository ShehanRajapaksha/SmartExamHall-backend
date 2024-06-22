const express = require('express');
const { createAdmin, loginAdmin } = require('../controllers/admins');
const router =express.Router();


router.route('/').post(createAdmin)
router.route("/login").post(loginAdmin)

module.exports = router